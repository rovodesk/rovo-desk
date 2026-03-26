/** biome-ignore-all lint/suspicious/useAwait: Analytics events are captured asynchronously */
import {
	USER_DELETED_EVENT,
	USER_LOGGED_OUT_EVENT,
	USER_SIGNED_UP_EVENT,
} from "@zero-heads-lab/analytics/events";
import type { IAnalytics } from "@zero-heads-lab/analytics/lib/analytics";
import type { ILogger } from "@zero-heads-lab/analytics/lib/logger";
import type { ITracer } from "@zero-heads-lab/analytics/lib/tracer";
import type { ICacheStore } from "@zero-heads-lab/cache/interface";
import type { Database } from "@zero-heads-lab/database";
import * as schema from "@zero-heads-lab/database/drizzle/schemas";
import { AuthRepository } from "@zero-heads-lab/database/repositories/auth";
import type { IAuthRepository } from "@zero-heads-lab/database/repositories/auth/auth.types";
import type { IEmailQueueService } from "@zero-heads-lab/email/interface";
import { loadTransactionalTemplate } from "@zero-heads-lab/email/templates";
import { extractOrigins, Placeholder } from "@zero-heads-lab/shared/utils";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { AUTH_CONFIG } from "../config";
import { keys } from "./keys";
import { AuthPlugins } from "./plugins";
import { OauthProviders } from "./social-providers";

export async function createAuth(
	cache: ICacheStore,
	database: Database,
	emailService: IEmailQueueService,
	analytics: IAnalytics,
	logger: ILogger,
	tracer: ITracer
) {
	const cacheStore: ICacheStore = cache.withPrefix("auth");
	const trustedAuthOrigins = extractOrigins(keys.ALLOWED_ORIGINS);
	const authRepo: IAuthRepository = new AuthRepository(database, tracer);

	const Plugins = await AuthPlugins(cacheStore, authRepo, analytics);

	return betterAuth({
		database: drizzleAdapter(database, {
			provider: "pg",
			schema,
		}),
		trustedOrigins: trustedAuthOrigins,
		secondaryStorage: {
			get: (key) => cacheStore.get(key),
			set: (key, value, ttl) => cacheStore.set(key, value, ttl),
			delete: (key) => cacheStore.delete(key),
		},
		baseURL: keys.BETTER_AUTH_URL,
		basePath: keys.BETTER_AUTH_BASE_PATH,
		emailVerification: {
			sendOnSignUp: true,
			sendOnSignIn: true,
			sendVerificationEmail: async ({ user, url }) => {
				// Find If already verified
				const userEmailVerificationStatus =
					await authRepo.query.findUserEmailVerificationStatus({
						userId: user.id,
					});
				if (userEmailVerificationStatus?.emailVerified) {
					return;
				}
				const template = await loadTransactionalTemplate(
					"EmailVerificationLinkTemplate"
				);

				await emailService.sendTransactional({
					to: user.email,
					subject: "Verify your email",
					react: template({ url }),
				});
			},
		},
		user: {
			deleteUser: {
				enabled: true,
				sendDeleteAccountVerification: async ({ url, user }) => {
					const template = await loadTransactionalTemplate(
						"AccountDeleteVerifiactionTemplate"
					);

					await emailService.sendTransactional({
						to: user.email,
						subject: "Confirm Account Deletion",
						react: template({ url }),
					});
				},
				afterDelete: async (user) => {
					// Send Analytics Event
					analytics.captureEvent(user.id, USER_DELETED_EVENT, {
						email: user.email,
					});
				},
			},
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
				stripeCustomerId: {
					type: "string",
					required: false,
					input: false,
				},
				deletedAt: {
					type: "date",
					required: false,
					defaultValue: null,
					input: false,
				},
				isAnonymous: {
					type: "boolean",
					required: false,
					input: false,
					defaultValue: true,
				},
			},
			changeEmail: {
				enabled: true,
				sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
					const template = await loadTransactionalTemplate(
						"ChangeEmailConfirmationTemplate"
					);
					await emailService.sendTransactional({
						to: newEmail,
						subject: "Verify your new email",
						react: template({
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
				strategy: "jwt",
			},
			preserveSessionInDatabase: true,
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
				trustedProviders: ["github", "google", "cognito"],
				allowDifferentEmails: false,
				allowUnlinkingAll: false,
			},
			// FIXME: CRITICAL SECURITY FLAW [REMOVE IN PRODUCTION, skipping state verification can lead to CSRF attacks]
			skipStateCookieCheck: process.env.NODE_ENV !== "production", // TRUE in development for ease of testing, FALSE in production for security
		},
		verification: {
			storeIdentifier: "hashed",
		},
		rateLimit: {
			enabled: process.env.NODE_ENV === "production",
			window: AUTH_CONFIG.RATE_LIMIT_WINDOW_IN_SECS,
			limit: AUTH_CONFIG.RATE_LIMIT_MAX_REQUESTS,
			storage: "secondary-storage",
			// customRules: {
			// 	"/example/path": {
			// 		window: 10,
			// 		max: 100,
			// 	},
			// },
		},
		plugins: Plugins,
		socialProviders: OauthProviders,
		advanced: {
			ipAddress: {
				ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
				disableIpTracking: false, // Enable IP Tracking [SECURITY]
			},
			useSecureCookies: process.env.NODE_ENV === "production", // FALSE on HTTP
			skipTrailingSlashes: true,
			crossSubDomainCookies: {
				enabled: true,
				domain: "localhost",
			},
			// cookies: {
			// 	session_token: {
			// 		// name: AUTH_CONFIG.SESSION_TOKEN_NAME,
			// 		attributes: {
			// 			httpOnly: true,
			// 			path: "/",
			// 			sameSite: "none",
			// 			secure: process.env.NODE_ENV === "production", // TRUE on HTTPS
			// 		},
			// 	},
			// },
			// defaultCookieAttributes: {
			// 	httpOnly: true,
			// 	secure: process.env.NODE_ENV === "production",
			// 	sameSite: "none",
			// 	// domain: "localhost",
			// },
			// cookiePrefix: AUTH_CONFIG.COOKIE_PREFIX,
		},
		logger: {
			disabled: false,
			disableColors: process.env.NODE_ENV === "production",
			level: process.env.NODE_ENV === "production" ? "error" : "debug", //FUTURE: Change to warn when completed
			log: (level, message, ...args) => {
				const data = { auth_args: args };
				switch (level.toLowerCase()) {
					case "debug":
						logger.debug("auth.logger", data);
						break;
					case "info":
						logger.info("auth.logger", data);
						break;
					case "error":
						logger.error(message, data);
						break;
					case "warn":
						// Auth Warnings are critical
						logger.warn(true, message, data);
						break;
					default:
						logger.info(message, data);
						break;
				}
			},
		},
		databaseHooks: {
			session: {
				delete: {
					after: async (session) => {
						analytics.captureEvent(session.userId, USER_LOGGED_OUT_EVENT, {
							ipAddress: session.ipAddress,
							userAgent: session.userAgent,
						});
					},
				},
			},
			user: {
				create: {
					before: async (user) => {
						const avatar: string = user.image
							? user.image
							: Placeholder.avatar(user.email);
						return {
							data: {
								...user,
								image: avatar,
								role: user.role || "owner",
							},
						};
					},
					after: async (user) => {
						// Create A New User Profile
						try {
							await authRepo.mutation.createNewUserWithProfileTX({
								userId: user.id,
							});
						} catch (error) {
							// Log the actual error to see why the DB rejected it (e.g., FK constraint)
							console.error("CRITICAL: Profile creation failed:", error);

							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Failed to create  user profile",
							});
						}

						// Send Welcome Email
						try {
							const template = await loadTransactionalTemplate(
								"UserWelcomeTemplate"
							);

							await emailService.sendTransactional({
								to: user.email,
								subject: "Welcome to Zero Heads",
								react: template({
									user,
									dashboardUrl: keys.END_USER_DASHBOARD_URL,
								}),
							});
						} catch (error) {
							console.error("Failed to send welcome email", error);
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Failed to send welcome email",
							});
						}

						// Send event to Analytics
						console.log("USER SIGNED UP", user);
						analytics.captureEvent(user.id, USER_SIGNED_UP_EVENT, {
							email: user.email,
							provider: user.lastLoginMethod ?? "email",
							role: user.role,
						});
					},
				},
				delete: {
					before: async (user) => {
						try {
							await authRepo.mutation.markUserAsDeleted({ userId: user.id });

							// Delete from Storage
							const userSessions = await authRepo.query.findUserSessions({
								userId: user.id,
							});
							if (userSessions && userSessions.length > 0) {
								await Promise.all(
									userSessions.map((session) =>
										cacheStore.delete(`session:${session.id}`)
									)
								);
							}

							await cacheStore.delete(`user:${user.id}`);
						} catch (error) {
							console.error("Failed to mark user as deleted", error);
							throw new APIError("INTERNAL_SERVER_ERROR");
						}
					},
					// after: async (user) => {

					// 	// try {
					// 	// 	await deleteCustomer(user.id);
					// 	// } catch (error) {
					// 	// 	console.error("Failed to delete customer", error);
					// 	// 	throw new APIError("INTERNAL_SERVER_ERROR");
					// 	// }
					// },
				},
			},
		},
	});
}
