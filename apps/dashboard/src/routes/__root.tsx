import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	type QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	redirect,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AuthProvider } from "@zero-heads-lab/auth/client";
import type { Session } from "@zero-heads-lab/auth/types";
import { UIProvider } from "@zero-heads-lab/design-system";
import appCss from "@zero-heads-lab/design-system/styles/default.css?url";
import { AppNavigationProgress } from "@/components/app-nav-progress";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	session?: Session;
}>()({
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

	return (
		<RootDocument>
			<QueryClientProvider client={queryClient}>
				<UIProvider>
					<AuthProvider replace={(href) => redirect({ to: href })}>
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

				<Scripts />
			</body>
		</html>
	);
}
