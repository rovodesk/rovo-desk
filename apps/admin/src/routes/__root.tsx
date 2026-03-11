import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { AnalyticsProvider } from "@zero-heads-lab/analytics/client/provider";
import { AuthProvider } from "@zero-heads-lab/auth/client";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { UIProvider } from "@zero-heads-lab/design-system";
// import { TanStackDevtools } from "@tanstack/react-devtools";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "@zero-heads-lab/design-system/components/ui/toast";
import appCss from "@zero-heads-lab/design-system/styles/default.css?url";
import { useEffect } from "react";
import { AppNavigationProgress } from "@/components/app-nav-progress";
import ReactQueryProvider from "@/providers/query";
import type { RouterContext } from "@/types/router-context";

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<AnalyticsProvider>
					<UIProvider>
						<ReactQueryProvider>
							<AuthProvider>
								<App>{children}</App>
							</AuthProvider>
						</ReactQueryProvider>
					</UIProvider>
				</AnalyticsProvider>
			</body>
		</html>
	);
}

function App({ children }: { children: React.ReactNode }) {
	const { session, isAuthenticated } = useSession();
	const router = useRouter();

	const authContext = {
		session,
		isAuthenticated,
		isAdmin: session?.user?.role === "admin",
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: AuthContext changes on every rerender not to include
	useEffect(() => {
		router.update({
			context: {
				...router.options.context,
				auth: authContext,
			},
		});
		router.invalidate();
	}, [session, isAuthenticated]);

	console.log(authContext);

	return (
		<>
			<AppNavigationProgress />
			{children}
			<Toaster />
			<Scripts />
		</>
	);
}
