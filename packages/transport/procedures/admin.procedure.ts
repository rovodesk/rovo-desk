import { ORPCError } from "@orpc/client";
import z from "zod";
import { base } from "../context";
import { AdminGuard } from "../middlewares/admin.middleware";
import { AuthGuard } from "../middlewares/auth.middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";

export const getAllOrganizations = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(AdminGuard)
	.input(
		z.object({
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
		})
	)
	.handler(async ({ context, input }) => {
		const auth = context.auth;
		const headers = context.reqHeaders;
		if (!headers) {
			throw new ORPCError("VALIDATION_ERROR", {
				message: "Headers is required",
			});
		}
		try {
			const { limit, offset, slug, sortBy, sortDirection } = input.query;

			// @ts-expect-error it is not in the contract but in docs
			// @https://better-auth.com/docs/plugins/organization#list-users-organizations
			const organizations = await auth.api.listOrganizations({
				headers,
			});

			let result = [...organizations];

			/* ---------------- FILTERS ---------------- */

			if (slug) {
				result = result.filter((org) =>
					org.slug?.toLowerCase().includes(slug.toLowerCase())
				);
			}

			/* ---------------- SORT ---------------- */

			result.sort((a, b) => {
				const aValue = a[sortBy];
				const bValue = b[sortBy];

				if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
				if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
				return 0;
			});

			/* ---------------- PAGINATION ---------------- */

			const total = result.length;

			const paginated = result.slice(offset, offset + limit);

			return {
				data: paginated,
				meta: {
					total,
					limit,
					offset,
					hasMore: offset + limit < total,
				},
			};
		} catch (error) {
			console.error(error);

			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to get organizations list",
			});
		}
	})
	.callable();
