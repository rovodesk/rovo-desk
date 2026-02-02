import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Auth } from "@/features/authentication";
import { authMiddleware } from "@/middlewares/auth.middleware";

export const Route = createFileRoute("/(auth)/sign-up")({
	server: {
		middleware: [authMiddleware],
	},
	component: SignUp,
	validateSearch: z.object({
		redirectUrl: z.string().optional(),
	}),
});

function SignUp() {
	return <Auth variant="sign-up" />;
}
