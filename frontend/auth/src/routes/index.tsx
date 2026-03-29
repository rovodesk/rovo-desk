import { createFileRoute, redirect } from "@tanstack/react-router";
import {
	AppAccessRoles,
	type AuthRole,
} from "@zero-heads-lab/auth/access-control";
import { determineAuthRoles } from "@zero-heads-lab/auth/helpers";
import { getCookie } from "@zero-heads-lab/shared/utils";
import { env } from "@/env";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		const auth = context.auth;
		const roles = determineAuthRoles(auth.session?.user?.role);

		// Check if redirectFrom is in cookie
		const redirectFrom = getCookie("redirectFrom");

		if (!auth.isAuthenticated) {
			throw redirect({ to: "/sign-in", search: { redirectFrom } });
		}

		// if (auth.isAuthenticated && redirectFrom) {
		//     throw redirect({ href: redirectFrom });
		// }

		if (auth.isAuthenticated && roles.includes("admin")) {
			throw redirect({ href: env.VITE_ADMIN_DASHBOARD_URL });
		}

		if (
			auth.isAuthenticated &&
			AppAccessRoles.some((role) => roles.includes(role as unknown as AuthRole))
		) {
			throw redirect({ href: env.VITE_CLIENT_DASHBOARD_URL });
		}

		throw redirect({ to: "/403" });
	},
});
