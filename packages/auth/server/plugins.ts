import { passkey } from "@better-auth/passkey";
import { sendEmail } from "@zero-heads-lab/email";
import { MagicLinkTemplate } from "@zero-heads-lab/email/templates";
import type { BetterAuthPlugin } from "better-auth";
import {
	admin as betterAuthAdmin,
	lastLoginMethod,
	magicLink,
	multiSession,
	openAPI,
	organization,
} from "better-auth/plugins";
<<<<<<< HEAD
import { AllRoles, accessControl } from "../access-control";
import { AUTH_CONFIG } from "../config";
=======
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { AllRoles, accessControl } from "../access-control";
import { AUTH_CONFIG } from "./config";
>>>>>>> 36d2c52 (feat: Implement robust access control and multi-session management with new server-side configurations and dashboard sidebar filtering.)

export const AuthPlugins = () => {
	// const products = getProducts();

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
				...AllRoles,
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
		process.env.NODE_ENV !== "production" && openAPI(),
		// Polar Plugin
		// polar({
		// 	client: polarClient,
		// 	createCustomerOnSignUp: false,
		// 	use: [
		// 		// Add Polar Plugins Here
		// 		checkout({
		// 			products: products.map((product) => ({
		// 				productId: product.productId,
		// 				slug: product.slug,
		// 			})),
		// 			successUrl: "/checkout-success?checkout_id={CHECKOUT_ID}",
		// 			authenticatedUsersOnly: true,
		// 		}),
		// 		portal(),
		// 		usage(),
		// 		// Add Polar Webhooks Here
		// 		webhooks({
		// 			secret: keys.POALR_WEBHOOK_SECRET,
		// 			onPayload: async (payload) => {
		// 				// Catch ALL for Events
		// 				// Redirect to Webhook Ingestion API
		// 				// 	await fetch("http://localhost:3001/api/webhook", {
		// 				// 		method: "POST",
		// 				// 		body: JSON.stringify(payload),
		// 				// 	});
		// 				await console.log(
		// 					`${payload.type}: ${payload.data}`,
		// 					payload.timestamp
		// 				);
		// 				//TODO: Add Analytics
		// 			},
		// 		}),
		// 	],
		// }),
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
			impersonationSessionDuration:
				AUTH_CONFIG.IMPERSONATION_SESSION_DURATION_IN_SECS,
		}),
<<<<<<< HEAD
=======
		// This must be at the last
		tanstackStartCookies(),
>>>>>>> 36d2c52 (feat: Implement robust access control and multi-session management with new server-side configurations and dashboard sidebar filtering.)
	].filter(Boolean) as BetterAuthPlugin[];
};
