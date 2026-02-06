import { createFileRoute } from "@tanstack/react-router";
import { hasPlatformAccessRole } from "@zero-heads-lab/auth/helpers";
import z from "zod";
import { AuthenticatedAdminLayout } from "@/features/admin/layout";

export const Route = createFileRoute("/admin")({
	component: AuthenticatedAdminLayout,
	validateSearch: z.object({
		redirectFrom: z.string().optional(), // TODO: Add validation
	}),
	beforeLoad: ({ context }) => {
		const isAuthenticated = context.auth?.isAuthenticated;
		if (!isAuthenticated) {
			console.log("NOT AUTHENTICATED, REDIRECTING");
			throw Route.redirect({
				to: "/sign-in",
				search: {
					redirectTo: window.location.href,
				},
			});
		}

		const role = context.auth?.session?.user.role;

		if (isAuthenticated && !hasPlatformAccessRole(role)) {
			console.log(
				"AUTHENTICATED END USER VISITED ADMIN DASHBOARD, REDIRECTING"
			);
			throw Route.redirect({
				to: "/",
				search: {
					redirectFrom: window.location.href,
				},
			});
		}
	},
});
