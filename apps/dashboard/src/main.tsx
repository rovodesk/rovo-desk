import "@zero-heads-lab/design-system/styles/default.css";

import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider, authClient } from "@zero-heads-lab/auth/client";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { UIProvider } from "@zero-heads-lab/design-system";
import { AppErrorBoundary } from "@zero-heads-lab/design-system/components/error-boundary";
import { Loader } from "@zero-heads-lab/design-system/components/loader";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { AxiosError } from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { handleMutationError } from "@/lib/utils/error";
import { OnboardingProvider } from "@/providers/onboarding";
import { routeTree } from "@/routeTree.gen";

import "@tanstack/react-router";
import { useOnboarding } from "@onboardjs/react";
import { SearchProvider } from "./providers/search";

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
				<QueryClientProvider client={queryClient}>
					<AuthProvider authClient={authClient}>
						<OnboardingProvider>
							<SearchProvider>
								<App />
							</SearchProvider>
						</OnboardingProvider>
					</AuthProvider>
				</QueryClientProvider>
			</AppErrorBoundary>
		</StrictMode>
	);
}

function App() {
	const { session, isAuthenticated, loading } = useSession();
	const { currentStep, isCompleted: onboardingIsCompleted } = useOnboarding();

	if (loading)
		return (
			<Loader
				subtitle="Something Great is Cooking..."
				title="Loading your profile..."
			/>
		);

	const authContext = {
		session,
		isAuthenticated,
		onboarding: {
			isCompleted: onboardingIsCompleted ?? false,
			currentStep: String(currentStep?.id ?? ""),
		},
	};
	console.log(authContext);

	return (
		<UIProvider>
			<RouterProvider context={{ auth: authContext }} router={router} />
		</UIProvider>
	);
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
	interface StaticDataRouteOption {
		breadcrumb?: string | ((params: Record<string, unknown>) => string);
	}
}
