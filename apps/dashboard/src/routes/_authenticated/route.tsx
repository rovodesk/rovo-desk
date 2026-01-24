import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import {
	createFileRoute,
	Outlet,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { getAuth } from "@/server/getAuth";

export const Route = createFileRoute("/_authenticated")({
	component: RouteComponent,
	beforeLoad: async ({ context, location }) => {
		const token = await getAuth();
		console.log("IsAuthenticated", !!token);

		if (!token) {
			throw redirect({
				to: "/sign-in",
				search: { redirect: location.href },
			});
		}

		if (context.convexQueryClient.serverHttpClient) {
			context.convexQueryClient.serverHttpClient.setAuth(token);
		}

		return {
			isAuthenticated: !!token,
			token,
		};
	},
});

function RouteComponent() {
	const { token, convexQueryClient } = useRouteContext({
		from: Route.id,
	});

	// Use the hook provided by Better Auth
	const { data: session } = authClient.useSession();

	useEffect(() => {
		// If the session becomes null (logout), kick them out
		if (session === null) {
			redirect({ to: "/sign-in" });
		}
	}, [session]);

	return (
		<ConvexBetterAuthProvider
			authClient={authClient}
			client={convexQueryClient.convexClient}
			initialToken={token}
		>
			<Outlet />
		</ConvexBetterAuthProvider>
	);
}
