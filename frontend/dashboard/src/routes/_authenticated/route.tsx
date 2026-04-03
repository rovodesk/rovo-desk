import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layout";
import { requireAuth } from "@/lib/auth/guards";

export const Route = createFileRoute("/_authenticated")({
	component: DashboardLayout,
	beforeLoad: ({ context }) => requireAuth({ auth: context.auth }),
});
