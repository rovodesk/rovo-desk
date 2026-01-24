import { createFileRoute, redirect } from "@tanstack/react-router"; // [!code ++]
import { Auth } from "@/features/authentication/auth";
import { getAuth } from "@/server/getAuth";

export const Route = createFileRoute("/(auth)/sign-up")({
	beforeLoad: async ({ location }) => {
		const token = await getAuth();
		if (token) {
			throw redirect({
				to: "/",
				statusCode: 302,
				search: location.href,
			});
		}
	},
	component: SignUp,
});

function SignUp() {
	return <Auth variant="sign-up" />;
}
