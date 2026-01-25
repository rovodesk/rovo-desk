import { createFileRoute, redirect } from "@tanstack/react-router"; // [!code ++]
import { Auth } from "@/features/authentication/auth";
import { fetchAuth } from "@/server/fetchAuth";

export const Route = createFileRoute("/(auth)/sign-up")({
	beforeLoad: async ({ location }) => {
		const { isAuthenticated } = await fetchAuth();

		// If already authenticated, bounce them away
		if (isAuthenticated) {
			throw redirect({
				to: "/",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: SignUp,
});

function SignUp() {
	return <Auth variant="sign-up" />;
}
