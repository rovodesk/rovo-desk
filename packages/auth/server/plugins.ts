import { apiKey } from "@better-auth/api-key";
import { passkey } from "@better-auth/passkey";
import { scim } from "@better-auth/scim";
import { sso } from "@better-auth/sso";
import { stripe } from "@better-auth/stripe";
import type { Analytics } from "@zero-heads-lab/analytics/types";
import { stripeClient, UserPlans } from "@zero-heads-lab/billing";
import type { KvCacheStore } from "@zero-heads-lab/cache";
import type { Database } from "@zero-heads-lab/database/conn";
import { createOrganizationWithProfileAndWidgetTX } from "@zero-heads-lab/database/repositories/auth/mutations";
import { sendEmail } from "@zero-heads-lab/email";
import {
	MagicLinkTemplate,
	OrganizationInviteTemplate,
} from "@zero-heads-lab/email/templates";
import {
	defaultWidgetConfig,
	defaultWorkspaceSettings,
} from "@zero-heads-lab/shared/defaults";
import { Placeholder } from "@zero-heads-lab/shared/utils";
import {
	admin as adminPlugin,
	type Jwk,
	jwt,
	lastLoginMethod,
	magicLink,
	multiSession,
	openAPI,
	organization,
} from "better-auth/plugins";

import {
	ADMIN_ROLES,
	accessControl,
	DEFAULT_ROLE,
	Roles,
} from "../access-control";
import { AUTH_CONFIG } from "../config";
import { determineAuthRole } from "../helpers";
import { keys } from "./keys";
import { SAML_CONFIG } from "./sso-config";

export const AuthPlugins = (
	cache: KvCacheStore,
	database: Database,
	analytics: Analytics
) => {
	// const products = getProducts();
	const cacheStore = cache;

	return [
		// Magic Link Plugin
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await sendEmail({
					to: email,
					subject: "Sign in to your account",
					react: MagicLinkTemplate({ url }),
				});
			},
		}),
		//Passkey Plugin
		passkey(),
		// Organization Plugin
		organization({
			accessControl,
			roles: {
				...Roles,
			},
			teams: {
				enabled: true,
				allowRemovingAllTeams: false, // Dont allow to remove the last team
			},
			schema: {
				organization: {
					additionalFields: {
						stripeCustomerId: {
							type: "string",
							required: false,
							input: false,
						},
						publicKey: {
							type: "string",
							required: false,
							input: false,
						},
						privateKey: {
							type: "string",
							required: false,
							input: false,
						},
					},
				},
			},
			sendInvitationEmail: async ({ organization, invitation, inviter }) => {
				await sendEmail({
					to: invitation.email,
					subject: "Invitation to join organization",
					react: OrganizationInviteTemplate({
						inviter: {
							name: inviter.user.name,
							email: inviter.user.email,
						},
						organization: {
							name: organization.name,
							slug: organization.slug,
						},
						email: invitation.email,
						invitation: {
							id: invitation.id,
						},
						acceptLink: "https://localhost:3001/accept-invite",
					}),
				});
			},
			organizationHooks: {
				// biome-ignore lint/suspicious/useAwait: No AWaited function
				beforeCreateOrganization: async ({ organization }) => {
					//TODO: Check billing plan
					console.log("Creating Organization", organization);
					return {
						data: {
							...organization,
						},
					};
				},
				afterCreateOrganization: async ({ organization }) => {
					// Create Profile
					try {
						const logo =
							organization.logo || Placeholder.logo(organization.name, "glass");
						await createOrganizationWithProfileAndWidgetTX(database, {
							organizationId: organization.id,
							workspaceConfig: defaultWorkspaceSettings(logo),
							widgetConfig: defaultWidgetConfig(organization.name, logo),
						});
					} catch (error) {
						console.error("Failed to create chatbot", error);
					}
					// Send Analytics Event
					analytics.captureImmediate({
						distinctId: organization.id,
						event: "organization_created",
						properties: {
							id: organization.id,
							name: organization.name,
							slug: organization.slug,
						},
					});
				},
				afterDeleteOrganization: async ({ organization }) => {
					// Send Analytics Event
					await analytics.captureImmediate({
						distinctId: organization.id,
						event: "organization_deleted",
						properties: {
							id: organization.id,
							name: organization.name,
							slug: organization.slug,
						},
					});
				},
			},
		}),
		// Multi Session Plugin
		multiSession({
			maximumSessions: AUTH_CONFIG.MAXIMUM_SESSIONS,
		}),
		// OPENAPI Plugin
		...(process.env.NODE_ENV !== "production" ? [openAPI()] : []),
		// Stripe Plugin
		stripe({
			stripeClient,
			stripeWebhookSecret: keys.STRIPE_WEBHOOK_SECRET,
			createCustomerOnSignUp: false, // Will be handled manually
			subscription: {
				enabled: true,
				plans: () => {
					return UserPlans.map((plan) => ({
						id: plan.priceId,
						name: plan.name,
						annualDiscountPriceId: plan.annualDiscountPriceId,
						limits: plan.limits,
						freeTrial: plan.freeTrial,
					}));
				},
				requireEmailVerification: true,
			},
		}),
		lastLoginMethod({
			storeInDatabase: true,
			customResolveMethod: (ctx) => {
				// Track magic link authentication
				if (ctx.path === "/magic-link/verify") {
					return "magic-link";
				}
				// Return null to use default resolution
				return null;
			},
		}),
		adminPlugin({
			ac: accessControl,
			roles: {
				...Roles,
			},
			defaultRole: DEFAULT_ROLE,
			adminRoles: [...ADMIN_ROLES],
			impersonationSessionDuration:
				AUTH_CONFIG.IMPERSONATION_SESSION_DURATION_IN_SECS,
		}),
		apiKey({
			defaultPrefix: AUTH_CONFIG.API_KEY_DEFAULT_PREFIX,
			references: "organization", // Owned by organizations
			rateLimit: {
				enabled: true,
				maxRequests: AUTH_CONFIG.API_KEY_RATE_LIMIT_MAX_REQUESTS,
				timeWindow: AUTH_CONFIG.API_KEY_RATE_LIMIT_TIME_WINDOW,
			},
			storage: "secondary-storage",
			fallbackToDatabase: true,
			enableMetadata: true,
			customStorage: {
				get: async (key) => {
					// Custom get logic for API keys
					return await cacheStore.get(key);
				},
				set: async (key, value, ttl) => {
					// Custom set logic for API keys
					await cacheStore.set(key, value, ttl);
				},
				delete: async (key) => {
					// Custom delete logic for API keys
					await cacheStore.delete(key);
				},
			},
		}),
		jwt({
			jwks: {
				keyPairConfig: {
					alg: AUTH_CONFIG.JWT_ALGORITHM,
				},
				jwksPath: "/.well-known/jwks.json",
			},
			jwt: {
				issuer: keys.BETTER_AUTH_URL,
				expirationTime: "1h",
				getSubject: (session) => session.user.id,
				definePayload: ({ user }) => ({
					id: user.id,
					email: user.email,
					verified: !!user.emailVerified,
					role: determineAuthRole(user.role),
					deleted: !!user.deletedAt,
				}),
			},
			adapter: {
				async getJwks() {
					const keys = await cacheStore.get<Jwk[]>("jwks");

					return keys ?? [];
				},

				async createJwk(data) {
					const id = crypto.randomUUID();

					const newKey: Jwk = {
						id,
						...data,
					};

					const existing = await cacheStore.get<Jwk[]>("jwks");
					const keys = existing ?? [];

					const updated = [newKey, ...keys].slice(0, 2); // keep last 2

					await cacheStore.set(
						"jwks",
						updated,
						AUTH_CONFIG.JWT_EXPIRATION_TIME_IN_SECS
					);

					return newKey;
				},
			},
		}),
		sso({
			defaultSSO: [
				{
					domain: keys.BETTER_AUTH_URL,
					providerId: "sso",
					samlConfig: SAML_CONFIG,
				},
			],
		}),
		scim(),
	];
};
