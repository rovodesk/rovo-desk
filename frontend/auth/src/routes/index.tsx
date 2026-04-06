import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCookie } from "@zero-heads-lab/shared/utils";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		const { isAuthenticated } = context.auth;
		// const roles = determineAuthRoles(auth.session?.user?.role);

		// Check if redirectFrom is in cookie
		const redirectFrom = getCookie("redirectFrom");

		if (!isAuthenticated) {
			throw redirect({ to: "/login", search: { redirectFrom } });
		}

		// if (auth.isAuthenticated && redirectFrom) {
		//     throw redirect({ href: redirectFrom });
		// }

		// if (auth.isAuthenticated && roles.includes("admin")) {
		// 	throw redirect({ href: env.VITE_ADMIN_DASHBOARD_URL });
		// }

		// if (
		// 	auth.isAuthenticated &&
		// 	AppAccessRoles.some((role) => roles.includes(role as unknown as AuthRole))
		// ) {
		// 	throw redirect({ href: env.VITE_CLIENT_DASHBOARD_URL });
		// }

		throw redirect({ to: "/403" });
	},
	component: () => (
		<div>
			<h1> Authenticated Page</h1>
		</div>
	),
});
