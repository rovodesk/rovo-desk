import { createFileRoute } from "@tanstack/react-router";
import { hasPlatformAccessRole } from "@zero-heads-lab/auth/helpers";
import { AdminDashboard } from "@/features/admin";

export const Route = createFileRoute("/_authenticated/admin/")({
	component: AdminDashboard,
	beforeLoad: ({ context }) => {
		const { auth } = context;

		const role = auth?.session?.user.role;

		if (!hasPlatformAccessRole(role)) {
			throw Route.redirect({
				to: "/",
			});
		}
	},
});
