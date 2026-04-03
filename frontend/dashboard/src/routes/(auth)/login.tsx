import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@zero-heads-lab/auth/lib/hooks";
import { useEffect } from "react";

export const Route = createFileRoute("/(auth)/login")({
	component: LoginPage,
});

function LoginPage() {
	const { login } = useAuth();

	// biome-ignore lint/correctness/useExhaustiveDependencies: login is a function and cannot be added to the dependency array
	useEffect(() => {
		login();
	}, []);
}
