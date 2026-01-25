import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthenticatedLayout } from "@/features/dashboard/layout";
import { fetchAuth } from "@/server/fetchAuth";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
	beforeLoad: async ({ context, location }) => {
		const { isAuthenticated, token, userId } = await fetchAuth();
		console.log("IsAuthenticated", isAuthenticated);
		console.log("User", userId);

		// Set Server Side Auth if we have the session
		if (context.convexQueryClient.serverHttpClient && token) {
			context.convexQueryClient.serverHttpClient.setAuth(token);
		}

		// Redirect to sign-in if not authenticated
		if (!isAuthenticated) {
			throw redirect({ to: "/sign-in", search: { redirect: location.href } });
		}
	},
});
