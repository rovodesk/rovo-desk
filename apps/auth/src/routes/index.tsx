import { createFileRoute, redirect } from "@tanstack/react-router";
import { determineAuthRole } from "@zero-heads-lab/auth/helpers";
import { env } from "@/env";

export const Route = createFileRoute("/")({
    beforeLoad: ({ context }) => {
        const auth = context.auth;
        const role = determineAuthRole(auth.session?.user?.role);

        if (!(auth.isAuthenticated && role) || auth.session?.user?.isAnonymous) {
            throw redirect({ to: "/sign-in" });
        }

        if (auth.isAuthenticated && role === "admin") {
            throw redirect({ href: env.VITE_ADMIN_DASHBOARD_URL });
        }

        if (auth.isAuthenticated && (role === "owner" || role === "member")) {
            throw redirect({ href: env.VITE_CLIENT_DASHBOARD_URL });
        }

        throw redirect({ to: "/403" });
    },
});
