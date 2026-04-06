import "@zero-heads-lab/design-system/styles/default.css";

import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AnalyticsProvider } from "@zero-heads-lab/analytics/client/provider";
import { UIProvider } from "@zero-heads-lab/design-system";
import { AppErrorBoundary } from "@zero-heads-lab/design-system/components/error-boundary";
import { Loader } from "@zero-heads-lab/design-system/components/loader";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { AxiosError } from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { useAuth } from "@/hooks/use-auth";
import { handleMutationError } from "@/lib/utils/error";
import { AuthProvider } from "@/providers/auth";
import { OnboardingProvider } from "@/providers/onboarding";
import { routeTree } from "@/routeTree.gen";

import "@tanstack/react-router";
import { SearchProvider } from "./providers/search";
import type { RouterContext } from "./types/router-context";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount, error) => {
				if (import.meta.env.DEV) console.log({ failureCount, error });

				if (failureCount >= 0 && import.meta.env.DEV) return false;
				if (failureCount > 3 && import.meta.env.PROD) return false;

				return !(
					error instanceof AxiosError &&
					[401, 403].includes(error.response?.status ?? 0)
				);
			},
			refetchOnWindowFocus: import.meta.env.PROD,
			staleTime: 10 * 1000, // 10s
		},
		mutations: {
			onError: (error) => {
				handleMutationError(error);

				if (error instanceof AxiosError && error.response?.status === 304) {
					toast.error("Content not modified!");
				}
			},
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					toast.error("Session expired!");
				}
				if (error.response?.status === 500) {
					toast.error("Internal Server Error!");
					// Only navigate to error page in production to avoid disrupting HMR in development
					if (import.meta.env.PROD) {
						router.navigate({ to: "/500" });
					}
				}
				if (error.response?.status === 403) {
					router.navigate({ to: "/403", replace: true });
				}
			}
		},
	}),
});

// Create a new router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: { queryClient, auth: undefined! },
	defaultNotFoundComponent: () => <NotFoundError />,
	defaultErrorComponent: () => <GeneralError />,
	scrollRestoration: true,
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<AppErrorBoundary>
				<AnalyticsProvider>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
							<OnboardingProvider>
								<SearchProvider>
									<UIProvider>
										<App />
									</UIProvider>
								</SearchProvider>
							</OnboardingProvider>
						</AuthProvider>
					</QueryClientProvider>
				</AnalyticsProvider>
			</AppErrorBoundary>
		</StrictMode>
	);
}

function App() {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<Loader // TODO: Get from feature flag
				subtitle="Something Great is Cooking..."
				title="Loading your profile..."
			/>
		);
	}

	const authContext: RouterContext["auth"] = {
		isAuthenticated,
		isLoading,
	};

	if (import.meta.env.DEV) {
		console.info("[AUTH]", JSON.stringify(authContext, null, 2));
	}

	return <RouterProvider context={{ auth: authContext }} router={router} />;
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
