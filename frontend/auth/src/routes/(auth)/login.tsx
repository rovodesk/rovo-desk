import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@zero-heads-lab/auth/use-auth";
import { useEffect } from "react";

export const Route = createFileRoute("/(auth)/login")({
	beforeLoad: ({ context }) => {
		const { isAuthenticated } = context.auth;
		if (isAuthenticated) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const { login, isLoading, isAuthenticated } = useAuth();

	useEffect(() => {
		if (!(isLoading || isAuthenticated)) {
			login({
				loginHint: "[EMAIL_ADDRESS]",
			});
		}
	}, [login, isLoading, isAuthenticated]);

	return null;
}
