import { createFileRoute } from "@tanstack/react-router";
import { Organizations } from "@/features/user-management/organizations";

export const Route = createFileRoute(
	"/_authenticated/user-management/organizations"
)({
	component: Organizations,
	validateSearch: (search) => ({
		slug: typeof search.slug === "string" ? search.slug : "",
		page: typeof search.page === "number" ? search.page : 1,
	}),
});
