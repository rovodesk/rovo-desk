import { notifyManager, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { routeTree } from "@/routeTree.gen";

// Setup Query Client with Convex
const queryClient: QueryClient = new QueryClient({
	defaultOptions: {
		queries: {},
	},
});

// Create a new router instance
export const getRouter = () => {
	if (typeof document !== "undefined") {
		notifyManager.setScheduler(window.requestAnimationFrame);
	}
	const router = createRouter({
		routeTree,
		defaultPreload: "intent",
		context: { queryClient },
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
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
