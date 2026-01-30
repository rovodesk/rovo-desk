import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@/features/authentication";
import authMiddleware from "@/middlewares/auth.middleware";

export const Route = createFileRoute("/(auth)/sign-in")({
	server: {
		middleware: [authMiddleware],
	},
	component: Auth,
});
