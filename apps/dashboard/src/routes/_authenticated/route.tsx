import { createFileRoute } from "@tanstack/react-router";
import { AuthenticatedLayout } from "@/features/dashboard/layout";
import authMiddleware from "@/middlewares/auth.middleware";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
	server: {
		middleware: [authMiddleware],
	},
});
