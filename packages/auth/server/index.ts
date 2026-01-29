// import { sendEmail } from "@workspace/email";
// import {
// 	AccountLinkingTemplate,
// 	ChangeEmailConfirmationTemplate,
// 	EmailVerificationOtpTemplate,
// 	MagicLinkTemplate,
// 	ResetPasswordLinkTemplate,
// 	ResetPasswordOtpTemplate,
// 	SignInOtpTemplate,
// } from "@workspace/email/templates";

import { createDatabase } from "@zero-heads-lab/database";
import {
	createNewUserProfile,
	getUserOrganizations,
	getUserTeams,
} from "@zero-heads-lab/database/repositories";
import {
	capitalize,
	generateUUID,
	Placeholder,
} from "@zero-heads-lab/shared/utils";
import {
	APIError,
	type BetterAuthPlugin,
	betterAuth,
	type GithubProfile,
	type GoogleProfile,
} from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
	anonymous,
	emailOTP,
	multiSession,
	openAPI,
	organization,
} from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { keys } from "../keys";

const AUTH_CONFIG = {
	EMAIL_OTP_LENGTH: 6,
	EMAIL_OTP_EXPIRE_IN: 10 * 60, // 10 minutes
	COOKIE_DOMAIN: "*.zeroheads.com",
	COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
	MAXIMUM_SESSIONS: 5,
	COOKIE_PREFIX: "zero-heads-auth",
	SESSION_TOKEN_NAME: "auth_session_token",
};

// export const trustedAuthOrigins = keys.AUTH_TRUSTED_ORIGINS.split(",").map(
// 	(o) => o.trim()
// );

function openAPISpecs(): BetterAuthPlugin {
	if (process.env.NODE_ENV !== "production")
		console.log("OPENAPI PATH", `${keys.BETTER_AUTH_BASE_PATH}/openapi`);
	return openAPI({
		path: `${keys.BETTER_AUTH_BASE_PATH}/openapi`,
	});
}

export async function createAuth() {
	return betterAuth({
		database: drizzleAdapter(await createDatabase(), {
			provider: "pg",
		}),
		baseURL: keys.BETTER_AUTH_URL,
		basePath: keys.BETTER_AUTH_BASE_PATH,
		usePlural: false,
		user: {
			additionalFields: {
				isAdmin: {
					type: "boolean",
					required: false,
					defaultValue: false,
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
				// sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
				// 	// await sendEmail({
				// 	// 	to: newEmail,
				// 	// 	subject: "Verify your new email",
				// 	// 	react: ChangeEmailConfirmationTemplate({
				// 	// 		user,
				// 	// 		newEmail,
				// 	// 		url,
				// 	// 	}),
				// 	// });
				// },
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
			},
		},
		account: {
			accountLinking: {
				enabled: true,
				trustedProviders: ["github", "google"],
				allowDifferentEmails: false,
				// sendAccountLinkingEmail: async ({
				// 	user,
				// 	url,
				// }: {
				// 	user: User;
				// 	url: string;
				// }) => {
				// 	// await sendEmail({
				// 	// 	to: user.email,
				// 	// 	subject: "Link your account",
				// 	// 	react: AccountLinkingTemplate({ user, url }),
				// 	// });
				// },
			},
		},
		plugins: [
			// Magic Link Plugin
			// magicLink({
			// 	sendMagicLink: async ({ email, url }) => {
			// 		// Send the magic link to the user
			// 		// await sendEmail({
			// 		// 	to: email,
			// 		// 	subject: "Sign in to your account",
			// 		// 	react: MagicLinkTemplate({ url }),
			// 		// });
			// 	},
			// }),
			// Email OTP Plugin
			emailOTP({
				otpLength: AUTH_CONFIG.EMAIL_OTP_LENGTH,
				expiresIn: AUTH_CONFIG.EMAIL_OTP_EXPIRE_IN,
				async sendVerificationOTP({ email, type }) {
					switch (type) {
						case "sign-in":
							// await sendEmail({
							// 	to: email,
							// 	subject: "Sign in verification",
							// 	react: SignInOtpTemplate({ otp }),
							// });
							await console.log("Sending Sign In OTP", email);
							break;

						case "email-verification":
							// await sendEmail({
							// 	to: email,
							// 	subject: "Verify your email",
							// 	react: EmailVerificationOtpTemplate({ otp }),
							// });
							await console.log("Sending Email Verification OTP", email);
							break;

						default:
							throw new Error(`Unsupported OTP type: ${type}`);
					}
				},
				overrideDefaultEmailVerification: false,
			}),
			//Anonymous User Plugin
			anonymous({
				generateRandomEmail: () => {
					const id = generateUUID("guest-");
					return `${id}@anonymous.zeroheads.com`;
				},
				onLinkAccount: ({ anonymousUser, newUser }) => {
					// TODO: Link Posthog user
					console.log("Anonymous User Linked", anonymousUser, newUser);
				},
				generateName() {
					return capitalize(Placeholder.name(3, " "));
				},
			}),
			// Organization Plugin
			organization({
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
			openAPISpecs(),
			// This must be at the last
			tanstackStartCookies(),
		],
		databaseHooks: {
			session: {
				create: {
					after: async (session) => {
						try {
							const organizations = await getUserOrganizations(session.userId);
							// If not, check all organizations and set the first one as active
							if (organizations.length > 0) {
								session.activeOrganizationId = organizations?.[0]?.id;
							}
							// Check if user has an active teamId
							const teams = await getUserTeams(session.userId);
							// If not, check all teams and set the first one as active
							if (teams.length > 0) {
								session.activeTeamId = teams?.[0]?.id;
							}
						} catch (error) {
							console.error("Failed to get user organizations", error);
							throw new APIError("INTERNAL_SERVER_ERROR");
						}
						// TODO: SEND USER EMAIL ON LOGIN
						console.log("NEW Device Logged In", session.ipAddress);
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
						try {
							await createNewUserProfile(user.id);
						} catch (error) {
							// Log the actual error to see why the DB rejected it (e.g., FK constraint)
							console.error("CRITICAL: Profile creation failed:", error);
							// If you throw here, the user might be created but the UI will show an error
							throw new APIError("INTERNAL_SERVER_ERROR");
						}
						// TODO: SEND WELCOME EMAIL TO USER
						console.log("User Created", user);
						// TODO: ADD ANALYTICS
					},
				},
			},
		},
		socialProviders: {
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
		},
		advanced: {
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
			cookiePrefix: AUTH_CONFIG.COOKIE_PREFIX,
		},
	});
}
