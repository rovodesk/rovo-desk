import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
// import { env } from "@/env";
import { Auth } from "@/components/auth";

export const Route = createFileRoute("/(auth)/sign-in")({
	component: SignIn,
	validateSearch: z.object({
		redirectFrom: z.string().optional(), // TODO: Add validation
		// redirectTo: z.string().optional().default(env.VITE_SIGN_IN_CALLBACK_URL), // TODO: Add validation
	}),
});

function SignIn() {
	const { redirectFrom } = Route.useSearch();
	return (
		<Auth
			redirectFrom={redirectFrom}
			// redirectTo={redirectTo}
			variant="sign-in"
		/>
	);
}
