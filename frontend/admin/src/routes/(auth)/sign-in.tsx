import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@/features/auth";

export const Route = createFileRoute("/(auth)/sign-in")({
	component: Auth,
});
