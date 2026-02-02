<<<<<<< HEAD
// import {
// 	createFreeSubscriptionOrder,
// 	deleteCustomer,
// 	getProducts,
// 	polarClient,
// } from "@zero-heads-lab/billing";
import { KvCacheStore } from "@zero-heads-lab/cache";
=======
import { passkey } from "@better-auth/passkey";
import {
	checkout,
	polar,
	portal,
	usage,
	webhooks,
} from "@polar-sh/better-auth";
import {
	createFreeSubscription,
	getProducts,
	polarClient,
} from "@zero-heads-lab/billing";
import { createCacheStore } from "@zero-heads-lab/cache";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import { createDatabase } from "@zero-heads-lab/database";
import {
	createNewUserWithProfile,
	deleteSession,
<<<<<<< HEAD
	markSessionAsRevoked,
	markUserAsDeleted,
} from "@zero-heads-lab/database/repositories/auth/mutations";
import {
	findReusableSession,
=======
	markUserAsDeleted,
} from "@zero-heads-lab/database/repositories/auth/mutations";
import {
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
	getUserEmailVerificationStatus,
	getUserSessionBootstrap,
	getUserSessions,
} from "@zero-heads-lab/database/repositories/auth/queries";
<<<<<<< HEAD
import { sendEmail } from "@zero-heads-lab/email";
=======
import { createSubscriptionFromPolar } from "@zero-heads-lab/database/repositories/billing/mutations";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import {
	ChangeEmailConfirmationTemplate,
	EmailVerificationLinkTemplate,
	LoginAlertTemplate,
	UserWelcomeTemplate,
} from "@zero-heads-lab/email/templates";
import { Placeholder } from "@zero-heads-lab/shared/utils";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { keys } from "../keys";
<<<<<<< HEAD
import { AUTH_CONFIG } from "./config";
import { AuthPlugins } from "./plugins";
import { OauthProviders } from "./social-providers";
=======

const AUTH_CONFIG = {
	EMAIL_OTP_LENGTH: 6,
	EMAIL_OTP_EXPIRE_IN: 10 * 60, // 10 minutes
	COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
	MAXIMUM_SESSIONS: 6,
	COOKIE_PREFIX: "zero-heads-auth",
	SESSION_TOKEN_NAME: "auth_session_token",
	RATE_LIMIT_WINDOW_IN_SECS: 10, // 10 seconds
	RATE_LIMIT_MAX_REQUESTS: 100,

	DASHBOARD_URL: "http://localhost:3000",
};
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

// export const trustedAuthOrigins = keys.AUTH_TRUSTED_ORIGINS.split(",").map(
// 	(o) => o.trim()
// );

<<<<<<< HEAD
export function createAuth(kv: KVNamespace) {
	const cacheStore = new KvCacheStore(kv);
=======
const Plugins = () => {
	const products = getProducts();

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
				owner,
				admin,
				member,
			},
			teams: {
				enabled: true,
				allowRemovingAllTeams: false, // Dont allow to remove the last team
			},
		}),
		// Multi Session Plugin
		multiSession({
			maximumSessions: AUTH_CONFIG.MAXIMUM_SESSIONS,
		}),
		// OPENAPI Plugin
		process.env.NODE_ENV !== "production" &&
			openAPI({
				path: `${keys.BETTER_AUTH_BASE_PATH}/openapi`,
			}),
		// Polar Plugin
		polar({
			client: polarClient,
			createCustomerOnSignUp: false,
			use: [
				// Add Polar Plugins Here
				checkout({
					products: products.map((product) => ({
						productId: product.productId,
						slug: product.slug,
					})),
					successUrl: "/checkout-success?checkout_id={CHECKOUT_ID}",
					authenticatedUsersOnly: true,
				}),
				portal(),
				usage(),
				// Add Polar Webhooks Here
				webhooks({
					secret: keys.POALR_WEBHOOK_SECRET,
					// biome-ignore lint/suspicious/useAwait: No awaited value
					onCustomerCreated: async (payload) => {
						console.log(payload);
					},
					onPayload: async (payload) => {
						// Catch ALL for Events
						// Redirect to Webhook Ingestion API
						// 	await fetch("http://localhost:3001/api/webhook", {
						// 		method: "POST",
						// 		body: JSON.stringify(payload),
						// 	});
						await console.log(
							`${payload.type}: ${payload.data}`,
							payload.timestamp
						);
						//TODO: Add Analytics
					},
				}),
			],
		}),
		// This must be at the last
		tanstackStartCookies(),
	].filter(Boolean) as BetterAuthPlugin[];
};

const SocialProviders = {
	github: {
		clientId: keys.GITHUB_CLIENT_ID,
		clientSecret: keys.GITHUB_CLIENT_SECRET,
		mapProfileToUser(profile: GithubProfile) {
			return {
				name: profile.name,
				image: profile.avatar_url,
			};
		},
	},
	google: {
		clientId: keys.GOOGLE_CLIENT_ID,
		clientSecret: keys.GOOGLE_CLIENT_SECRET,
		mapProfileToUser(profile: GoogleProfile) {
			return {
				name: `${profile.given_name} ${profile.family_name}`,
				image: profile.picture,
			};
		},
	},
};

export function createAuth() {
	const cacheStore = createCacheStore();
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
	const database = createDatabase();

	const Plugins = AuthPlugins();

	return betterAuth({
		database: drizzleAdapter(database, {
			provider: "pg",
		}),
		secondaryStorage: {
			get: async (key) => {
				return await cacheStore.get(key);
			},
			set: async (key, value, ttl) => {
				if (ttl) await cacheStore.set(key, value, ttl);
				else await cacheStore.set(key, value);
			},
			delete: async (key) => {
				await cacheStore.delete(key);
			},
		},
		baseURL: keys.BETTER_AUTH_URL,
		basePath: keys.BETTER_AUTH_BASE_PATH,
		usePlural: false,
		emailVerification: {
			sendOnSignUp: true,
			sendOnSignIn: true,
			sendVerificationEmail: async ({ user, url }) => {
				// Find If already verified
				const userEmailVerificationStatus =
					await getUserEmailVerificationStatus(user.id);
				if (userEmailVerificationStatus?.emailVerified) {
					return;
				}
				await sendEmail({
					to: user.email,
					subject: "Verify your email",
					react: EmailVerificationLinkTemplate({ url }),
				});
			},
		},
		user: {
			additionalFields: {
				lastLoginMethod: {
					type: "string",
					required: false,
					input: false,
				},
				role: {
					type: "string",
					required: true,
					input: false,
				},
				banned: {
					type: "boolean",
					required: false,
					input: false,
				},
				banReason: {
					type: "string",
					required: false,
					input: false,
				},
				banExpires: {
					type: "date",
					required: false,
					input: false,
				},
				isAnonymous: {
					type: "boolean",
					required: false,
					input: false,
				},
				deletedAt: {
					type: "date",
					required: false,
					defaultValue: null,
					input: false,
				},
			},
			changeEmail: {
				enabled: true,
				sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
					await sendEmail({
						to: newEmail,
						subject: "Verify your new email",
						react: ChangeEmailConfirmationTemplate({
							user,
							newEmail,
							url,
						}),
					});
				},
			},
		},
		session: {
			cookieCache: {
				enabled: true,
				maxAge: AUTH_CONFIG.COOKIE_MAX_AGE,
			},
			additionalFields: {
				activeOrganizationId: {
					type: "string",
					required: false,
					defaultValue: null,
					input: false,
				},
				activeTeamId: {
					type: "string",
					required: false,
					defaultValue: null,
					input: false,
				},
				isAnonymous: {
					type: "boolean",
					required: false,
					input: false,
				},
				deviceId: {
					type: "string",
					required: false,
					input: false,
				},
				lastActiveAt: {
					type: "date",
					required: false,
					input: false,
				},
				revokedAt: {
					type: "date",
					required: false,
					input: false,
				},
			},
		},
		account: {
			encryptOAuthTokens: true,
			accountLinking: {
				enabled: true,
				trustedProviders: ["github", "google"],
				updateUserInfoOnLink: true,
<<<<<<< HEAD
			},
		},
		rateLimit: {
			enabled: true,
			window: AUTH_CONFIG.RATE_LIMIT_WINDOW_IN_SECS,
			limit: AUTH_CONFIG.RATE_LIMIT_MAX_REQUESTS,
			storage: "secondary-storage",
		},
		plugins: Plugins,
		socialProviders: OauthProviders,
		advanced: {
			ipAddress: {
				ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
				disableIpTracking: false, // Enable IP Tracking [SECURITY]
			},
			useSecureCookies: true,
			cookies: {
				session_token: {
					name: AUTH_CONFIG.SESSION_TOKEN_NAME,
					attributes: {
						httpOnly: true,
						path: "/",
						sameSite: "lax",
						secure: true,
					},
				},
			},
			defaultCookieAttributes: {
				httpOnly: true,
				secure: true,
				sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
			},
			cookiePrefix: AUTH_CONFIG.COOKIE_PREFIX,
		},
		logger: {
			disabled: false,
			disableColors: process.env.NODE_ENV === "production",
			level: process.env.NODE_ENV === "production" ? "error" : "debug", //FUTURE: Change to warn when completed
			log: (level, message, ...args) => {
				// TODO: Add Logger from observability
				console.log(
					["AUTH", new Date().toISOString(), level.toUpperCase()].join(" "),
					message,
					...args
				);
			},
		},
		databaseHooks: {
			session: {
				create: {
					// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Need this
					before: async (session, ctx) => {
						// Reuse Session
						const { userId, userAgent } = session;
						const deviceId = ctx?.request?.headers.get("device-id");

						if (deviceId && userAgent && !session.isAnonymous) {
							const reusableSession = await findReusableSession({
								userId,
								userAgent,
								deviceId,
							});

							if (reusableSession) {
								// IMPORTANT:
								// Returning an existing session here tells better-auth
								// to SKIP creation and reuse this one.
								return {
									data: {
										reuse: true,
										...reusableSession,
									},
								};
=======
			},
		},
		rateLimit: {
			enabled: true,
			window: AUTH_CONFIG.RATE_LIMIT_WINDOW_IN_SECS,
			limit: AUTH_CONFIG.RATE_LIMIT_MAX_REQUESTS,
			storage: "secondary-storage",
		},
		plugins: Plugins(),
		socialProviders: SocialProviders,
		advanced: {
			ipAddress: {
				ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
				disableIpTracking: false, // Enable IP Tracking [SECURITY]
			},
			useSecureCookies: true,
			cookies: {
				session_token: {
					name: AUTH_CONFIG.SESSION_TOKEN_NAME,
					attributes: {
						httpOnly: true,
						path: "/",
						sameSite: "lax",
						secure: true,
					},
				},
			},
			defaultCookieAttributes: {
				httpOnly: true,
				secure: true,
				sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
			},
			cookiePrefix: AUTH_CONFIG.COOKIE_PREFIX,
		},
		logger: {
			disabled: false,
			disableColors: process.env.NODE_ENV === "production",
			level: process.env.NODE_ENV === "production" ? "error" : "debug", //FUTURE: Change to warn when completed
			log: (level, message, ...args) => {
				// TODO: Add Logger from observability
				console.log(
					["AUTH", new Date().toISOString(), level.toUpperCase()].join(" "),
					message,
					...args
				);
			},
		},
		databaseHooks: {
			session: {
				create: {
					before: async (session) => {
						// Find All Available User Sessions
						const sessions = await getUserSessions(session.userId);
						// If All available session of the user are greater than the max session value then delete the oldest session
						if (sessions && sessions.length >= AUTH_CONFIG.MAXIMUM_SESSIONS) {
							const oldestSession = sessions.at(-1);
							if (oldestSession) {
								try {
									// 1. Delete from DB
									await deleteSession(oldestSession.id);

									// 2. Manual Cache Invalidation
									// Better-Auth uses specific keys for sessions.
									// Usually: "session:[token]" or "session:[id]"
									await cacheStore.delete(`session:${oldestSession.id}`);
									console.log(`Evicted session ${oldestSession.id} from cache`);
								} catch (error) {
									console.error(
										`Failed to evict session ${oldestSession.id} from cache`,
										error
									);
									throw new APIError("INTERNAL_SERVER_ERROR", {
										message: "Failed to evict session from cache",
									});
								}
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
							}
						}

						// Enforce maximum sessions (only if creating a new one)
						const sessions = await getUserSessions(session.userId);
						if (sessions && sessions.length >= AUTH_CONFIG.MAXIMUM_SESSIONS) {
							// If All available session of the user are greater than the max session value then delete the oldest session
							const oldestSession = sessions.at(-1);
							if (oldestSession) {
								try {
									// 1. Delete from DB
									await deleteSession(oldestSession.id);

									// 2. Manual Cache Invalidation
									// Better-Auth uses specific keys for sessions.
									// Usually: "session:[token]" or "session:[id]"
									await cacheStore.delete(`session:${oldestSession.id}`);
									console.log(`Evicted session ${oldestSession.id} from cache`);
								} catch (error) {
									console.error(
										`Failed to evict session ${oldestSession.id} from cache`,
										error
									);
									throw new APIError("INTERNAL_SERVER_ERROR", {
										message: "Failed to evict session from cache",
									});
								}
							}
						}
						// Allow the session to be created
						return;
					},
					after: async (session) => {
						try {
							const rows = await getUserSessionBootstrap(session.userId);

							if (!rows.length) {
								throw new APIError("BAD_REQUEST", {
									message: "User not found",
								});
							}

							const firstRow = rows[0];

							// Set active organization
							const org = rows.find((r) => r.organizationId);
							if (org) {
								session.activeOrganizationId = org.organizationId;
							}

							// Set active team
							const team = rows.find((r) => r.teamId);
							if (team) {
								session.activeTeamId = team.teamId;
							}

							// Send login alert email
							if (firstRow?.email) {
								await sendEmail({
									to: firstRow.email,
									subject: "New login to your account",
									react: LoginAlertTemplate({
										ipAddress: session.ipAddress || "Unknown",
										userAgent: session.userAgent || "Unknown",
										time: session.createdAt.toISOString(),
										securityUrl: `${AUTH_CONFIG.DASHBOARD_URL}/settings/security`,
									}),
								});
							}
						} catch (error) {
							console.error("Failed to bootstrap user session", error);
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Failed to initialize user session",
							});
						}
					},
				},
				delete: {
					before: async (session) => {
						console.log(`Session  ${session.id} is being revoked`);
						try {
							try {
								await markSessionAsRevoked(session.id);
							} catch {
								// Ignore
							}
							// Delete session from cache
							await cacheStore.delete(`session:${session.id}`);
						} catch (error) {
							console.error("Failed to revoke session", error);
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Failed to revoke session",
							});
						}
						return false;
					},
				},
			},
			user: {
				create: {
					// biome-ignore lint/suspicious/useAwait: No awaited value
					before: async (user) => {
						if (!user.image) {
							return {
								data: {
									...user,
									image: Placeholder.avatar(user.email),
								},
							};
						}
						return {
							data: {
								...user,
							},
						};
					},
					after: async (user) => {
						let orgId: string | null = null;
						// Create User Profile
						try {
<<<<<<< HEAD
							await createNewUserWithProfile(user.id);
=======
							const { orgId: oId } = await createNewUserWithProfile(user.id);
							orgId = oId;
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
						} catch (error) {
							// Log the actual error to see why the DB rejected it (e.g., FK constraint)
							console.error("CRITICAL: Profile creation failed:", error);
							// If you throw here, the user might be created but the UI will show an error
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: `Failed to create profile because ${error}`,
							});
						}

<<<<<<< HEAD
						// //Subscribe User to Basic PLan
						// try {
						// 	await createFreeSubscriptionOrder(
						// 		user.id,
						// 		user.name,
						// 		user.email,
						// 		user.emailVerified,
						// 		orgId,
						// 		orgName,
						// 		orgSlug,
						// 		teamId,
						// 		teamName
						// 	);
						// } catch (error) {
						// 	console.error("Failed to create subscription", error);
						// 	throw new APIError("INTERNAL_SERVER_ERROR", {
						// 		message: "Failed to create subscription",
						// 	});
						// }
=======
						//Subscribe User to Basic PLan
						try {
							const sub = await createFreeSubscription(user.id);
							await createSubscriptionFromPolar({
								userId: user.id,
								organizationId: orgId,
								payload: sub,
							});
						} catch (error) {
							console.error("Failed to create subscription", error);
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Failed to create subscription",
							});
						}
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

						try {
							await sendEmail({
								to: user.email,
								subject: "Welcome to Zero Heads",
								react: UserWelcomeTemplate({
									user,
									dashboardUrl: AUTH_CONFIG.DASHBOARD_URL,
								}),
							});
						} catch (error) {
							console.error("Failed to send welcome email", error);
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Failed to send welcome email",
							});
						}
						// TODO: ADD ANALYTICS
					},
				},
				delete: {
					before: async (user) => {
						console.log(`User ${user.email} is being deleted`);
						try {
							await markUserAsDeleted(user.id);
							// Delete from Cache
							const userSessions = await getUserSessions(user.id);
							userSessions.forEach((session) => {
								cacheStore.delete(`session:${session.id}`);
							});
							await cacheStore.delete(`user:${user.id}`);
						} catch (error) {
							console.error("Failed to mark user as deleted", error);
							throw new APIError("INTERNAL_SERVER_ERROR");
						}
						//TODO: Add Analytics
						return false; // Abort the deletion
					},
<<<<<<< HEAD
					after: async (user) => {
						await console.log(`User ${user.email} is deleted`);
						//TODO: Add Analytics
						// try {
						// 	await deleteCustomer(user.id);
						// } catch (error) {
						// 	console.error("Failed to delete customer", error);
						// 	throw new APIError("INTERNAL_SERVER_ERROR");
						// }
					},
=======
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
				},
			},
		},
	});
}
