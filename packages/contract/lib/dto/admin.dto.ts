import { z } from "zod";
import { ORGANIZATION } from "./auth.dto";

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
