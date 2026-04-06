import { z } from "zod";

export const ORGANIZATION = z.object({
	slug: z.string(),
	name: z.string(),
	createdAt: z.date(),
	id: z.string(),
	logo: z.string().nullable(),
	metadata: z.unknown(),
	stripeCustomerId: z.string().nullable(),
	updatedAt: z.date().nullable(),
	deletedAt: z.date().nullable(),
});

export const LIST_ORGANIZATIONS_INPUT_DTO = z.object({
	query: z
		.object({
			limit: z.number().min(1).max(100).default(10),
			offset: z.number().min(0).default(0),

			slug: z.string().optional(),

			sortBy: z.enum(["name", "slug", "createdAt"]).default("createdAt"),
			sortDirection: z.enum(["asc", "desc"]).default("desc"),
		})
		.default({
			limit: 10,
			offset: 0,
			sortBy: "createdAt",
			sortDirection: "desc",
		}),
});

export const LIST_ORGANIZATIONS_OUTPUT_DTO = z.object({
	data: z.array(ORGANIZATION),
	meta: z.object({
		total: z.number(),
		limit: z.number(),
		offset: z.number(),
		hasMore: z.boolean(),
	}),
});
