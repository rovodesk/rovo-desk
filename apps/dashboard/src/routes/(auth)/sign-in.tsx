import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { Auth } from "@/features/authentication";

export const Route = createFileRoute("/(auth)/sign-in")({
	component: Auth,
	validateSearch: z.object({
		redirectReason: z.string().optional(),
	}),
});
