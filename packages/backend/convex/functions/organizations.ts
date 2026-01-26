import { v } from "convex/values";
import { internalMutation, mutation, query } from "../_generated/server";

export const createDomainFromWebhook = internalMutation({
	args: {
		name: v.string(),
		clerkId: v.string(), // The unique Clerk ID (org_...)
		slug: v.string(),
		ownerId: v.string(),
		imageUrl: v.string(),
	},
	handler: async (ctx, args) => {
		console.log("LIST QUERY RAN");

		const existing = await ctx.db
			.query("organizations")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)) // Fix: use clerkId, not slug
			.unique();

		if (!existing) {
			await ctx.db.insert("organizations", args);
		}
	},
});

export const createDomain = mutation({
	args: {
		name: v.string(),
		slug: v.string(),
		clerkId: v.string(),
		imageUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];
		// Check if it already exists to prevent duplicates
		const existing = await ctx.db
			.query("organizations")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
			.unique();

		if (!existing) {
			await ctx.db.insert("organizations", {
				...args,
				ownerId: identity.subject,
			});
		}
	},
});

export const listUserDomains = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		// Fetch from your 'organizations' table synced by webhooks
		return await ctx.db
			.query("organizations")
			.withIndex("by_ownerId", (q) => q.eq("ownerId", identity.subject))
			.collect();
	},
});

export const deleteDomainFromWebhook = internalMutation({
	args: {
		clerkId: v.string(),
	},
	handler: async (ctx, args) => {
		// Use a loop or .first() to handle any legacy duplicates
		// that might be breaking .unique()
		const existing = await ctx.db
			.query("organizations")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
			.first();

		if (existing) {
			await ctx.db.delete(existing._id);
			console.log("Successfully deleted Convex record:", existing._id);
		} else {
			console.log("No record found in Convex for Clerk ID:", args.clerkId);
		}
	},
});
