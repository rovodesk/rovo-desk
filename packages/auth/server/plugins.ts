/** biome-ignore-all lint/suspicious/useAwait: need to await */
import { apiKey } from "@better-auth/api-key";
import { passkey } from "@better-auth/passkey";
import { scim } from "@better-auth/scim";
import { sso } from "@better-auth/sso";
import { stripe } from "@better-auth/stripe";
import {
	MAGIC_LINK_SENT_EVENT,
	ORGANIZATION_CREATED_EVENT,
	ORGANIZATION_DELETED_EVENT,
	ORGANIZATION_INVITATION_SENT_EVENT,
} from "@zero-heads-lab/analytics/events";
import type { IAnalytics } from "@zero-heads-lab/analytics/lib/analytics";
import { stripeClient, UserPlans } from "@zero-heads-lab/billing";
import type { ICacheStore } from "@zero-heads-lab/cache";
import type { IAuthRepository } from "@zero-heads-lab/database/repositories/auth/auth.types";
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
import type { BetterAuthPlugin } from "better-auth";
import {
	admin as adminPlugin,
	anonymous,
	type Jwk,
	jwt,
	lastLoginMethod,
	magicLink,
	multiSession,
	openAPI,
	organization,
	testUtils,
} from "better-auth/plugins";
import { determineAuthRoles } from "@/helpers";
import {
	ADMIN_ROLES,
	accessControl,
	DEFAULT_ROLE,
	Roles,
} from "../access-control";
import { AUTH_CONFIG } from "../config";
import { keys } from "./keys";
import { SAML_CONFIG } from "./sso-config";

export const AuthPlugins = async (
	cache: ICacheStore,
	authRepository: IAuthRepository,
	analytics: IAnalytics
): Promise<BetterAuthPlugin[]> => {
	// const products = getProducts();
	const cacheStore = cache;

	const basePlugins = [
		// Magic Link Plugin
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				try {
					await sendEmail({
						to: email,
						subject: "Sign in to your account",
						react: MagicLinkTemplate({ url }),
					});
					try {
						analytics.captureEvent(email, MAGIC_LINK_SENT_EVENT, { url });
					} catch (error) {
						await analytics.captureException({
							error,
							distinctId: email,
							properties: {
								url,
							},
						});
					}
				} catch (error) {
					await analytics.captureException({
						error,
						distinctId: email,
						properties: {
							url,
						},
					});
				}
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
				try {
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
					try {
						await analytics.captureEvent(
							invitation.email,
							ORGANIZATION_INVITATION_SENT_EVENT,
							{
								organizationId: organization.id,
								invitationId: invitation.id,
								role: invitation.role,
								inviterId: inviter.userId,
								inviterRole: inviter.role,
							}
						);
					} catch (error) {
						console.error(
							"Failed to send organization invitation event",
							error
						);
					}
				} catch (error) {
					await analytics.captureException({
						error,
						distinctId: invitation.email,
						properties: {
							organizationId: organization.id,
							invitationId: invitation.id,
							role: invitation.role,
							inviterId: inviter.userId,
							inviterRole: inviter.role,
						},
					});
				}
			},
			organizationHooks: {
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
						await authRepository.mutation.createOrganizationWithProfileAndWidgetTX(
							{
								organizationId: organization.id,
								workspaceConfig: defaultWorkspaceSettings(logo),
								widgetConfig: defaultWidgetConfig(organization.name, logo),
							}
						);
					} catch (error) {
						console.error("Failed to create chatbot", error);
					}
					try {
						// Send Analytics Event
						analytics.captureEvent(
							organization.id,
							ORGANIZATION_CREATED_EVENT,
							{
								id: organization.id,
								name: organization.name,
								slug: organization.slug,
							}
						);
					} catch (error) {
						console.error("Failed to send organization created event", error);
					}
				},
				afterDeleteOrganization: async ({ organization }) => {
					try {
						// Send Analytics Event
						await analytics.captureEvent(
							organization.id,
							ORGANIZATION_DELETED_EVENT,
							{
								id: organization.id,
								name: organization.name,
								slug: organization.slug,
							}
						);
					} catch (error) {
						try {
							await analytics.captureException({
								error,
								distinctId: organization.id,
								properties: {
									id: organization.id,
									name: organization.name,
									slug: organization.slug,
								},
							});
						} catch (error) {
							console.error("Failed to delete organization", error);
						}
					}
				},
			},
		}),
		// Multi Session Plugin
		multiSession({
			maximumSessions: AUTH_CONFIG.MAXIMUM_SESSIONS,
		}),
		// OPENAPI Plugin
		...(process.env.NODE_ENV !== "production" ? [openAPI()] : []),
		// Test Utils
		...(process.env.NODE_ENV !== "production" ? [testUtils()] : []),
		//Last Login Method Plugin
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
		apiKey([
			{
				configId: "public",
				defaultPrefix: "rovodesk_pk_",
				references: "organization",
				rateLimit: {
					enabled: true,
					maxRequests: 100,
					timeWindow: 1000 * 60 * 60, // 1 hour
				},
				disableKeyHashing: true,
				fallbackToDatabase: true,
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
			},
			{
				configId: "secret",
				defaultPrefix: "rovodesk_sk_",
				references: "organization", // Owned by organizations
				enableMetadata: true,
				fallbackToDatabase: true,
				rateLimit: {
					enabled: true,
					maxRequests: 1000,
					timeWindow: 1000 * 60 * 60, // 1 hour
				},
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
			},
		]),
		jwt({
			alg: AUTH_CONFIG.JWT_ALGORITHM,
			jwksPath: "/.well-known/jwks.json",
			jwt: {
				issuer: keys.BETTER_AUTH_URL,
				expirationTime: "1h",
				getSubject: (session) => session.user.id,
				definePayload: ({ user }) => {
					return {
						id: user.id,
						email: user.email,
						verified: !!user.emailVerified,
						role: determineAuthRoles(user.role),
						isAnonymous: !!user.isAnonymous,
						deleted: !!user.deletedAt,
					};
				},
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
		// Anonymous Users Plugin
		anonymous({
			generateName: () => {
				return `anonymous-${Placeholder.name(2, "-")}`;
			},
			onLinkAccount: async ({ anonymousUser, newUser }) => {
				// Send Analytics Event
				try {
					// 2️⃣ Identify the real user
					await analytics.identify(newUser.user.id, anonymousUser.user.id, {
						name: newUser.user.name,
						email: newUser.user.email,
						avatar: newUser.user.image,
					});
				} catch (error) {
					try {
						await analytics.captureException({
							error,
							distinctId: newUser.user.id,
							properties: {
								anonymousUserId: anonymousUser.user.id,
								newUserId: newUser.user.id,
							},
						});
					} catch (error) {
						console.error("Failed to link anonymous account", error);
					}
				}
			},
		}),
		stripe({
			stripeClient,
			stripeWebhookSecret: keys.STRIPE_WEBHOOK_SECRET,
			createCustomerOnSignUp: false,
			subscription: {
				enabled: true,
				plans: () =>
					UserPlans.map((plan) => ({
						id: plan.priceId,
						name: plan.name,
						annualDiscountPriceId: plan.annualDiscountPriceId,
						limits: plan.limits,
						freeTrial: plan.freeTrial,
					})),
				requireEmailVerification: true,
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

	return [...basePlugins];
};
