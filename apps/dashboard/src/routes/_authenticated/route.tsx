import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layout";

export const Route = createFileRoute("/_authenticated")({
	component: DashboardLayout,
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
	},
});
