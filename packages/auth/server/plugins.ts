import { passkey } from "@better-auth/passkey";
import { stripe } from "@better-auth/stripe";
import { stripeClient, UserPlans } from "@zero-heads-lab/billing";
import { createChatbotWithDefaults } from "@zero-heads-lab/database/repositories/chatbot/mutations";
import { sendEmail } from "@zero-heads-lab/email";
import {
	MagicLinkTemplate,
	OrganizationInviteTemplate,
} from "@zero-heads-lab/email/templates";
import type { BetterAuthPlugin } from "better-auth";
import {
	admin as betterAuthAdmin,
	lastLoginMethod,
	magicLink,
	multiSession,
	openAPI,
	organization,
} from "better-auth/plugins";
import { accessControl, PLATFORM_ROLES, Roles } from "../access-control";
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
					// Create A Chatbot for Organization
					try {
						await createChatbotWithDefaults({
							organizationId: organization.id,
							name: "Default Chatbot",
						});
					} catch (error) {
						console.error("Failed to create chatbot", error);
					}
					//TODO: Add analytics
					console.log("New Organization Created", organization);
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
	].filter(Boolean) as BetterAuthPlugin[];
};
