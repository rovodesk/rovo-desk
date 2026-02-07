import { createFileRoute } from "@tanstack/react-router";
import { AuthenticatedLayout } from "@/layout";
<<<<<<< HEAD
=======
import authMiddleware from "@/middlewares/auth.middleware";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});
