import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { Session } from "@zero-heads-lab/auth/types";
import { Toaster } from "@zero-heads-lab/design-system/components/ui/toast";
import { AppNavigationProgress } from "@/components/app-nav-progress";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	session?: Session;
}>()({
	component: () => {
		return (
			<>
				<AppNavigationProgress />
				<Outlet />
				<Toaster />

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
