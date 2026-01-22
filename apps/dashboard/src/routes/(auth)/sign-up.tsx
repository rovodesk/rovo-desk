import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router"; // [!code ++]
import { api } from "@zero-heads-lab/backend/convex/_generated/api";

export const Route = createFileRoute("/(auth)/sign-up")({
	beforeLoad: async ({ context }) => {
		// Fetch the user data
		const user = await context.queryClient.ensureQueryData(
			convexQuery(api.auth.getCurrentUser, {})
		);
		// If user exists, they shouldn't be on the Sign Up page
		if (user) {
			throw redirect({
				to: "/",
				statusCode: 302,
			});
		}
	},
	component: SignUp,
});

function SignUp() {
	return <div>Sign Up</div>;
}
