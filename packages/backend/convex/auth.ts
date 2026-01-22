import type { GenericCtx } from "@convex-dev/better-auth";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { keys } from "../keys";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth({
		baseURL: keys.BETTER_AUTH_URL,
		database: authComponent.adapter(ctx),
		// Configure simple, non-verified email/password to get started
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		socialProviders: {
			google: {
				prompt: "select_account consent",
				clientId: keys.GOOGLE_CLIENT_ID,
				clientSecret: keys.GOOGLE_CLIENT_SECRET,
			},
			github: {
				clientId: keys.GITHUB_CLIENT_ID,
				clientSecret: keys.GITHUB_CLIENT_SECRET,
			},
		},
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex({ authConfig }),
		],
	});
};

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		try {
			return await authComponent.getAuthUser(
				ctx as unknown as GenericCtx<DataModel>
			);
		} catch (_error) {
			// Better Auth throws when no session exists.
			// We catch it and return null so the frontend knows we're just "logged out."
			return null;
		}
	},
});
