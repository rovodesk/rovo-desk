// import {
// 	createFreeSubscriptionOrder,
// 	deleteCustomer,
// 	getProducts,
// 	polarClient,
// } from "@zero-heads-lab/billing";

import { KvCacheStore } from "@zero-heads-lab/cache";
import { createDatabase } from "@zero-heads-lab/database";
import {
	deleteSession,
	markSessionAsRevoked,
} from "@zero-heads-lab/database/repositories/auth/mutations";
import {
	// findReusableSession,
	getUserEmailVerificationStatus,
	getUserSessionBootstrap,
	getUserSessions,
} from "@zero-heads-lab/database/repositories/auth/queries";
import { sendEmail } from "@zero-heads-lab/email";
import {
	ChangeEmailConfirmationTemplate,
	EmailVerificationLinkTemplate,
	LoginAlertTemplate,
} from "@zero-heads-lab/email/templates";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { keys } from "../keys";

const trustedAuthOrigins = keys.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

export function createAuth(namespace: KVNamespace) {
	const cacheStore = new KvCacheStore(namespace);
	const database = createDatabase();

	return betterAuth({
		database: drizzleAdapter(database, {
			provider: "pg",
		}),
		trustedOrigins: trustedAuthOrigins,
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
				// deviceId: {
				// 	type: "string",
				// 	required: false,
				// 	input: false,
				// },
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
		}
	,
		account:
	encryptOAuthTokens: true, accountLinking
	:
	enabled: true, trustedProviders
	: ["github", "google"],
				updateUserInfoOnLink: true,
	,
	,
		// rateLimit: {
		// 	enabled: true,
		// 	window: AUTH_CONFIG.RATE_LIMIT_WINDOW_IN_SECS,
		// 	limit: AUTH_CONFIG.RATE_LIMIT_MAX_REQUESTS,
		// 	storage: "secondary-storage",
		// },
		plugins: Plugins,
		socialProviders: OauthProviders,
		advanced:
	ipAddressHeaders: ["x-client-ip", "x-forwarded-for"], disableIpTracking
	: false, // Enable IP Tracking [SECURITY]
	,
			useSecureCookies: true,
			cookies:
	name: AUTH_CONFIG.SESSION_TOKEN_NAME, attributes
	:
	httpOnly: true, path
	: "/",
						sameSite: "lax",
						secure: true,
	,
	,
	,
			defaultCookieAttributes:
	httpOnly: true, secure
	: true,
				sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
	,
			cookiePrefix: AUTH_CONFIG.COOKIE_PREFIX,
	,
		logger:
	disabled: false, disableColors
	: process.env.NODE_ENV === "production",
			level: process.env.NODE_ENV === "production" ? "error" : "debug", //FUTURE: Change to warn when completed
			log: (level, message, ...args) =>
	// TODO: Add Logger from observability
	console.log(
		["AUTH", new Date().toISOString(), level.toUpperCase()].join(" "),
		message,
		...args
	)
	,
	,
		databaseHooks:{
					before: async (session) => 
						// Reuse Session
						// const { userId, userAgent } = session;
						// const deviceId = ctx?.request?.headers.get("device-id");

						// if (deviceId && userAgent && !session.isAnonymous) {
						// 	const reusableSession = await findReusableSession({
						// 		userId,
						// 		userAgent,
						// 		deviceId,
						// 	});

						// 	if (reusableSession) {
						// 		// IMPORTANT:
						// 		// Returning an existing session here tells better-auth
						// 		// to SKIP creation and reuse this one.
						// 		return {
						// 			data: {
						// 				reuse: true,
						// 				...reusableSession,
						// 			},
						// 		};
						// 	}
						// }

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
}
,
					after: async (session) =>
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
,,
				delete: 
					before: async (session) =>
{
	console.log(`Session  ${session.id} is being revoked`);
	try {
		<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 36d2c52 (feat: Implement robust access control and multi-session management
		with new server-side configurations
		and;
		dashboard;
		sidebar;
		filtering.
		)
		try {
			await markSessionAsRevoked(session.id);
		} catch {
			// Ignore
		}
		<<<<<<< HEAD
=======
							await markSessionAsRevoked(session.id)
			>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
=======
>>>>>>> 36d2c52 (feat: Implement robust access control and multi-session management
		with new server-side configurations
		and;
		dashboard;
		sidebar;
		filtering.
		)
							// Delete session from cache
							await cacheStore.delete(`session:$session.id`)
	} catch (error) {
		console.error("Failed to revoke session", error);
		throw new APIError("INTERNAL_SERVER_ERROR", {
			message: "Failed to revoke session",
		});
	}
	return false;
}
,
}
,
			},
			user:
{
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
		after;
	: async (user) =>
	try {
		<<<<<<< HEAD
<<<<<<< HEAD
							await createNewUserWithProfile(user.id)
				=======
		const { orgId: oId } = await createNewUserWithProfile(user.id);
		orgId = oId;
		>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
							await createNewUserWithProfile(user.id)
				>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
	} catch (error) {
		// Log the actual error to see why the DB rejected it (e.g., FK constraint)
		console.error("CRITICAL: Profile creation failed:", error);
		// If you throw here, the user might be created but the UI will show an error
		throw new APIError("INTERNAL_SERVER_ERROR", {
			message: "Failed to create profile because $error",
		});
	}

	<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
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
<<<<<<< HEAD
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
	,
	,
				delete:
	before: async (user) =>
		console.log("User $user.emailis being deleted")
	try {
		await markUserAsDeleted(user.id);
		// Delete from Cache
		const userSessions = await getUserSessions(user.id);
		userSessions.forEach((session) => {
			cacheStore.delete("session:$session.id");
		});
		await cacheStore.delete("user:$user.id");
	} catch (error) {
		console.error("Failed to mark user as deleted", error);
		throw new APIError("INTERNAL_SERVER_ERROR");
	}
	//TODO: Add Analytics
	return false; // Abort the deletion
	,
		after
	: async (user) =>
	await console.log("User $user.emailis deleted")
	,
	,
}
