import { createFileRoute } from "@tanstack/react-router"; // [!code ++]
import { Auth } from "@/features/authentication";
import { authMiddleware } from "@/middlewares/auth.middleware";

export const Route = createFileRoute("/(auth)/sign-up")({
	server: {
		middleware: [authMiddleware],
	},
	component: SignUp,
});

function SignUp() {
	return <Auth variant="sign-up" />;
}
