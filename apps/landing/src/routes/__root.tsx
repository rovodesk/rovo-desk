import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { AnalyticsProvider } from "@zero-heads-lab/analytics/client/provider";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { UIProvider } from "@zero-heads-lab/design-system";
import { fonts } from "@zero-heads-lab/design-system/context/font";
import { CookieConsent } from "@/components/cookie-consent";
import Footer from "@/components/Footer";
import appCss from "@/styles/app.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
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
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className={`wrap-anywhere ${fonts} antialiased`}>
				<AnalyticsProvider>
					<UIProvider>
						{children}
						<Footer />
						{/* <TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/> */}
						<Scripts />
					</UIProvider>

					{/* Cookie Consent */}
					<CookieConsent
						onAcceptCallback={() => console.log("accepted")}
						onDeclineCallback={() => console.log("declined")}
					/>
				</AnalyticsProvider>
			</body>
		</html>
	);
}
