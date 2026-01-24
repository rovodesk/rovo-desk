import { ConvexQueryClient } from "@convex-dev/react-query";
import { notifyManager, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ConvexReactClient } from "@zero-heads-lab/backend";
import { env } from "./env";
import { GeneralError } from "./features/errors/general-error";
import { NotFoundError } from "./features/errors/not-found-error";
import { routeTree } from "./routeTree.gen";

// Create Convex Client
const convex = new ConvexReactClient(env.VITE_CONVEX_URL, {
	unsavedChangesWarning: false,
	expectAuth: true,
});

// Setup Query Client with Convex
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient: QueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexQueryClient.hashFn(),
			queryFn: convexQueryClient.queryFn(),
		},
	},
});
convexQueryClient.connect(queryClient);

// Create a new router instance
export const getRouter = () => {
	if (typeof document !== "undefined") {
		notifyManager.setScheduler(window.requestAnimationFrame);
	}
	const router = createRouter({
		routeTree,
		defaultPreload: "intent",
		context: { queryClient, convexQueryClient },
		defaultNotFoundComponent: () => <NotFoundError />,
		defaultErrorComponent: () => <GeneralError />,
		scrollRestoration: true,
	});
	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});
	return router;
};

// Register the router instance for type safety
import "@tanstack/react-router";

declare module "@tanstack/react-router" {
	interface RouterContext {
		queryClient: import("@tanstack/react-query").QueryClient;
		convexQueryClient: import("@convex-dev/react-query").ConvexQueryClient;
		auth?: {
			token: string;
		};
	}
}
