import { passkey } from "@better-auth/passkey";
import { stripe } from "@better-auth/stripe";
import { stripeClient, UserPlans } from "@zero-heads-lab/billing";
import { countUserOrganizations } from "@zero-heads-lab/database/repositories/auth/queries";
import { sendEmail } from "@zero-heads-lab/email";
import { MagicLinkTemplate } from "@zero-heads-lab/email/templates";
import { APIError, type BetterAuthPlugin } from "better-auth";
import {
	admin as betterAuthAdmin,
	lastLoginMethod,
	magicLink,
	multiSession,
	openAPI,
	organization,
} from "better-auth/plugins";
import {
	accessControl,
	anonymous,
	deleted,
	moderator,
	organizationAdmin,
	organizationMember,
	organizationOwner,
	superAdmin,
	support,
	unverified,
	verified,
} from "../access-control";
import { AUTH_CONFIG } from "../config";
import { keys } from "./keys";

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
				superAdmin,
				moderator,
				support,

				organizationOwner,
				organizationAdmin,
				organizationMember,

				verified,
				unverified,
				anonymous,

				deleted,
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
					},
				},
			},
			organizationHooks: {
				afterCreateOrganization: async ({ organization }) => {
					// Check if first organization of the user.
					try {
						const result = await countUserOrganizations(organization.userId);
						if (!result) {
							throw new APIError("INTERNAL_SERVER_ERROR", {
								message: "Unable to count user organizations",
							});
						}
						//TODO: Add analytics
						console.log("User Organizations Count", result?.count);
					} catch (error) {
						console.error(error);
						throw new APIError("INTERNAL_SERVER_ERROR", {
							message: "Unable to count user organizations",
						});
					}
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
				superAdmin,
				moderator,
				support,

				organizationOwner,
				organizationAdmin,
				organizationMember,

				verified,
				unverified,
				anonymous,

				deleted,
			},
			adminRoles: ["superAdmin", "moderator", "support"],
			impersonationSessionDuration:
				AUTH_CONFIG.IMPERSONATION_SESSION_DURATION_IN_SECS,
		}),
	].filter(Boolean) as BetterAuthPlugin[];
};
