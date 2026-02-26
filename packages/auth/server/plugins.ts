import { passkey } from "@better-auth/passkey";
import { stripe } from "@better-auth/stripe";
import { stripeClient, UserPlans } from "@zero-heads-lab/billing";
import type { KvCacheStore } from "@zero-heads-lab/cache";
import type { Database } from "@zero-heads-lab/database/conn";
import {
	createSDKWithDefaultsTransaction,
	deleteSDK,
} from "@zero-heads-lab/database/repositories/sdk/mutations";
import { sendEmail } from "@zero-heads-lab/email";
import {
	MagicLinkTemplate,
	OrganizationInviteTemplate,
} from "@zero-heads-lab/email/templates";
import type { BetterAuthPlugin } from "better-auth";
import {
	apiKey,
	admin as betterAuthAdmin,
	type Jwk,
	jwt,
	lastLoginMethod,
	magicLink,
	multiSession,
	openAPI,
	organization,
} from "better-auth/plugins";
import { accessControl, PLATFORM_ROLES, Roles } from "../access-control";
import { AUTH_CONFIG } from "../config";
import { keys } from "./keys";

export const AuthPlugins = (cache: KvCacheStore, database: Database) => {
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
				afterCreateOrganization: async ({ organization }) => {
					// Create Public and Private Keys
					// Create A Chatbot for Organization
					try {
						await createSDKWithDefaultsTransaction({
							organizationId: organization.id,
							name: "Default Widget",
						});
					} catch (error) {
						console.error("Failed to create chatbot", error);
					}
					//TODO: Add analytics
					console.log("New Organization Created", organization);
				},
				afterDeleteOrganization: async ({ organization }) => {
					// Delete Chatbot
					try {
						await deleteSDK(database, { sdkId: organization.id });
					} catch (error) {
						console.error("Failed to delete chatbot", error);
					}
					//TODO: Add Analytics
					console.log("Organization Deleted", organization);
				},
			},
		}),
		// Multi Session Plugin
		multiSession({
			maximumSessions: AUTH_CONFIG.MAXIMUM_SESSIONS,
		}),
		// OPENAPI Plugin
		process.env.NODE_ENV !== "production" && openAPI(),
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
		betterAuthAdmin({
			roles: {
				...Roles,
			},
			defaultRole: "anonymous",
			adminRoles: [...PLATFORM_ROLES],
			impersonationSessionDuration:
				AUTH_CONFIG.IMPERSONATION_SESSION_DURATION_IN_SECS,
		}),
		apiKey(),
		jwt({
			jwks: {
				keyPairConfig: {
					alg: AUTH_CONFIG.JWT_ALGORITHM,
				},
			},
			jwt: {
				issuer: AUTH_CONFIG.JWT_ISSUER,
				expirationTime: "1h",
				getSubject: (session) => session.user.id,
				definePayload: ({ user }) => ({
					id: user.id,
					email: user.email,
					verified: user.emailVerified,
					role: user.role,
					anonymous: user.isAnonymous,
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
	].filter(Boolean) as BetterAuthPlugin[];
};
