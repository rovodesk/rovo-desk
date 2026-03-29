import { createFileRoute } from "@tanstack/react-router";
import type { AuthRole } from "@zero-heads-lab/auth/access-control";
import Users from "@/features/user-management/users";

export const Route = createFileRoute("/_authenticated/user-management/")({
	component: Users,
	validateSearch: (search) => ({
		role: (search.role as unknown as AuthRole | "all") ?? "all",
		email: typeof search.email === "string" ? search.email : "",
		page: typeof search.page === "number" ? search.page : 1,
	}),
});
