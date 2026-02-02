import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { Auth } from "@/features/authentication";
<<<<<<< HEAD
=======
import { authMiddleware } from "@/middlewares/auth.middleware";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

export const Route = createFileRoute("/(auth)/sign-in")({
	component: Auth,
	validateSearch: z.object({
		redirectUrl: z.string().optional(),
		verified: z.string().optional(),
	}),
});
