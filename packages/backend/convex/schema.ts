import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const usersTable = defineTable({
	first_name: v.string(),
	last_name: v.string(),
	clerkId: v.string(),
}).index("by_clerkId", ["clerkId"]);

const organizationsTable = defineTable({
	name: v.string(),
	clerkId: v.string(),
	ownerId: v.string(),
	slug: v.optional(v.string()),
	imageUrl: v.optional(v.string()),
})
	.index("by_clerkId", ["clerkId"])
	.index("by_ownerId", ["ownerId"])
	.index("by_slug", ["slug"]);

export default defineSchema({
	users: usersTable,
	organizations: organizationsTable,
});
