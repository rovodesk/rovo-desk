import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { Auth } from "@/features/auth";

export const Route = createFileRoute("/(auth)/sign-in")({
	component: SignIn,
	validateSearch: z.object({
		redirectFrom: z.string().optional(), // TODO: Add validation
		// redirectTo: z.string().optional().default(env.VITE_SIGN_IN_CALLBACK_URL), // TODO: Add validation
	}),
	beforeLoad: ({ context }) => {
		const auth = context.auth;
		console.log("Sign IN route", JSON.stringify(auth, null, 2))

		if (
			auth?.session &&
			!auth.session.user.isAnonymous &&
			auth.session.user.role === "admin"
		) {
			throw redirect({ to: "/" });
		}
	},
});

function SignIn() {
	const { redirectFrom } = Route.useSearch();
	return <Auth redirectFrom={redirectFrom} />;
}
