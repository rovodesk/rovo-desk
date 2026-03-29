import { createFileRoute } from "@tanstack/react-router";
import { extractOrigins, setCookie } from "@zero-heads-lab/shared/utils";
import { z } from "zod";
import { Auth } from "@/components/auth";
import { env } from "@/env";

export const Route = createFileRoute("/(auth)/sign-up")({
	component: SignUp,
	validateSearch: z.object({
		redirectFrom: z.string().optional(),
		// redirectTo: z.string().optional().default(env.VITE_SIGN_IN_CALLBACK_URL), // TODO: Add validation
	}),
});

function SignUp() {
	// Save redirectFrom in cookie if it is allowed
	const { redirectFrom } = Route.useSearch();
	const allowedOrigins = extractOrigins(env.VITE_ALLOWED_REDIRECT_FROM_URLS);
	if (redirectFrom && allowedOrigins.includes(redirectFrom)) {
		setCookie("redirectFrom", redirectFrom, 60 * 60 * 1);
	}
	return <Auth variant="sign-up" />;
}
