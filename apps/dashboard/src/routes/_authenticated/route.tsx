import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import {
	createFileRoute,
	Outlet,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { getToken } from "@/lib/auth/server";

// Get auth information for SSR using available cookies
const getAuth = createServerFn({ method: "GET" }).handler(async () => {
	return await getToken();
});

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
	const navigate = Route.useNavigate();

	// Use the hook provided by Better Auth
	const { data: session } = authClient.useSession();

	useEffect(() => {
		// If the session becomes null (logout), kick them out
		if (session === null) {
			navigate({ to: "/sign-in" });
		}
	}, [session, navigate]);

	// If you specifically want to subscribe to changes outside of the standard React render cycle (or if useSession isn't behaving), you use the $store property on the client.
	// useEffect(() => {
	// 	// Better Auth uses a store pattern under the hood
	// 	const unsubscribe = authClient.$store.listen((state) => {
	// 		if (!state.session) {
	// 			navigate({ to: "/sign-in" });
	// 		}
	// 	});
	// 	return () => unsubscribe();
	// }, [navigate]);

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
