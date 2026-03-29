import { createFileRoute, redirect } from "@tanstack/react-router";
import { determineAuthRole } from "@zero-heads-lab/auth/helpers";
import { DashboardLayout } from "@/layout";

export const Route = createFileRoute("/_authenticated")({
	component: DashboardLayout,
	beforeLoad: ({ context }) => {
		const auth = context.auth;
		const role = determineAuthRole(auth.session?.user?.role);

		if (!auth.isAuthenticated) {
			throw redirect({ to: "/sign-in" });
		}

		if (auth.isAuthenticated && role !== "admin") {
			throw redirect({ to: "/403" });
		}
	},
});
