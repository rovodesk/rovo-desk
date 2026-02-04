import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	type QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
<<<<<<< HEAD
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { Session } from "@zero-heads-lab/auth/types";
import { Toaster } from "@zero-heads-lab/design-system/components/ui/toast";
=======
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AuthProvider } from "@zero-heads-lab/auth/client";
import type { Session } from "@zero-heads-lab/auth/types";
import { UIProvider } from "@zero-heads-lab/design-system";
import appCss from "@zero-heads-lab/design-system/styles/default.css?url";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import { AppNavigationProgress } from "@/components/app-nav-progress";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { authClient } from "@/lib/auth-client";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	session?: Session;
}>()({
<<<<<<< HEAD
	component: () => {
		return (
			<>
				<AppNavigationProgress />
				<Outlet />
				<Toaster />
=======
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Zero Heads Dashboard" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),

	component: RootComponent,
	notFoundComponent: NotFoundError,
	errorComponent: GeneralError,
});

function RootComponent() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return (
		<RootDocument>
			<QueryClientProvider client={queryClient}>
				<UIProvider>
					<AuthProvider
						authClient={authClient}
						replace={(href) => router.navigate({ to: href })}
					>
						<AppNavigationProgress />
						<Outlet />
					</AuthProvider>
				</UIProvider>
			</QueryClientProvider>
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

				{import.meta.env.DEV && (
					<>
						<TanStackDevtools
							config={{ position: "bottom-right" }}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
							]}
						/>
						<ReactQueryDevtools buttonPosition="top-right" />
					</>
				)}
			</>
		);
	},

	notFoundComponent: NotFoundError,
	errorComponent: GeneralError,
});
