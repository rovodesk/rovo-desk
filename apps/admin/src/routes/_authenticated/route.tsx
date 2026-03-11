import { createFileRoute, redirect } from "@tanstack/react-router";
import { determineAuthRole } from "@zero-heads-lab/auth/helpers";
import AdminLayout from "@/layout";

export const Route = createFileRoute("/_authenticated")({
	component: AdminLayout,
	beforeLoad: ({ location, context }) => {
		const auth = context.auth;
		console.log("Auth Route", JSON.stringify(auth, null, 2));

		const role = determineAuthRole(auth?.session?.user?.role);

		if (!auth?.session || auth.session?.user?.isAnonymous) {
			throw redirect({
				to: "/sign-in",
				search: { redirectFrom: location.pathname },
			});
		}
		if (auth?.session && role !== "admin") {
			throw redirect({ to: "/403" });
		}

		return {
			auth: {
				session: auth.session,
				isAuthenticated: true,
				isAdmin: true,
			},
		};
	},
});
