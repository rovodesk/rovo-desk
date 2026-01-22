import type { GenericCtx } from "@convex-dev/better-auth";
import { v } from "convex/values";
import type { DataModel } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

export const updateUserPassword = mutation({
	args: {
		currentPassword: v.string(),
		newPassword: v.string(),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(
			createAuth,
			ctx as unknown as GenericCtx<DataModel>
		);
		await auth.api.changePassword({
			body: {
				currentPassword: args.currentPassword,
				newPassword: args.newPassword,
			},
			headers,
		});
	},
});
