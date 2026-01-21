import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexProvider, ConvexReactClient } from "@zero-heads-lab/backend";
import { env } from "./env";
import { GeneralError } from "./features/errors/general-error";
import { NotFoundError } from "./features/errors/not-found-error";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const CONVEX_URL = env.VITE_CONVEX_URL;
	if (!CONVEX_URL) {
		throw new Error("VITE_CONVEX_URL is not defined");
	}

	// Create Convex Client
	const convex = new ConvexReactClient(CONVEX_URL, {
		unsavedChangesWarning: false,
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

	// Create Router with Query Client
	const router = routerWithQueryClient(
		createRouter({
			routeTree,
			defaultPreload: "intent",
			defaultNotFoundComponent: () => <NotFoundError />,
			defaultErrorComponent: () => <GeneralError />,
			scrollRestoration: true,
			context: { queryClient },
			Wrap: ({ children }) => {
				return (
					<ConvexProvider client={convexQueryClient.convexClient}>
						{children}
					</ConvexProvider>
				);
			},
		}),
		queryClient
	);

	return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
