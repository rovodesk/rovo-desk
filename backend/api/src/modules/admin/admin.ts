import { implement, ORPCError } from "@orpc/server";
import { AdminContract } from "@zero-heads-lab/contract/orpc/admin.contract";
import { AdminGuard } from "@/lib/guards/admin.guard";
import { AuthGuard } from "@/lib/guards/auth.guard";
import { BaseGuard } from "@/lib/guards/base.guard";

const os = implement(AdminContract);

export const list = os.organization.list
	.use(BaseGuard)
	.use(AuthGuard)
	.use(AdminGuard)
	.handler(async ({ context, input }) => {
		const { auth, headers } = context;
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
