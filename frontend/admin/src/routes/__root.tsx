import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
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
			</>
		);
	},

	notFoundComponent: NotFoundError,
	errorComponent: GeneralError,
});
