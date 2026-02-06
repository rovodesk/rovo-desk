import { createFileRoute } from "@tanstack/react-router";
import { hasPlatformAccessRole } from "@zero-heads-lab/auth/helpers";
import { AuthenticatedLayout } from "@/features/dashboard/layout";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
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

		if (isAuthenticated && hasPlatformAccessRole(role)) {
			console.log(
				"AUTHENTICATED PLATFORM USER VISITED END USER DASHBOARD, REDIRECTING"
			);
			throw Route.redirect({
				to: "/admin",
				search: {
					redirectFrom: window.location.href,
				},
			});
		}
	},
});
