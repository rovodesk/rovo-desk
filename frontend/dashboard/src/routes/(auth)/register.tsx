import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@zero-heads-lab/auth/lib/hooks";
import { useEffect } from "react";

export const Route = createFileRoute("/(auth)/register")({
	component: RegisterPage,
});

function RegisterPage() {
	const { register } = useAuth();

	// biome-ignore lint/correctness/useExhaustiveDependencies: register is a function and cannot be added to the dependency array
	useEffect(() => {
		register();
	}, []);
}
