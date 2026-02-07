import { TanStackDevtools } from "@tanstack/react-devtools";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<<<<<<< HEAD

import { Toaster } from "@zero-heads-lab/design-system/components/ui/toast";

=======

import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AuthProvider } from "@zero-heads-lab/auth/client";
import type { Session } from "@zero-heads-lab/auth/types";
import { UIProvider } from "@zero-heads-lab/design-system";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

import { AppNavigationProgress } from "@/components/app-nav-progress";

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
					<AuthProvider replace={(href) => router.navigate({ to: href })}>
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
