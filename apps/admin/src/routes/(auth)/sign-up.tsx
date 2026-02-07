import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Auth } from "@/features/authentication";

export const Route = createFileRoute("/(auth)/sign-up")({
	component: SignUp,
	validateSearch: z.object({
		redirectUrl: z.string().optional(),
	}),
});

function SignUp() {
	return <Auth variant="sign-up" />;
}
