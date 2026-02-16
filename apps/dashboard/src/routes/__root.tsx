import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "@zero-heads-lab/design-system/components/ui/toast";
import { AppNavigationProgress } from "@/components/app-nav-progress";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import type { RouterContext } from "@/types/router-context";

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => {
		return (
			<>
				<AppNavigationProgress />
				<Outlet />
				<Toaster />

				{import.meta.env.DEV && (
					<>
						<TanStackDevtools
							config={{ position: "bottom-left" }}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
							]}
						/>
						<ReactQueryDevtools buttonPosition="top-left" />
					</>
				)}
			</>
		);
	},

	notFoundComponent: NotFoundError,
	errorComponent: GeneralError,
});
