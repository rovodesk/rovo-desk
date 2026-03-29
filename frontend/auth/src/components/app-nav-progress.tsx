import { useRouterState } from "@tanstack/react-router";
import { NavigationProgress } from "@zero-heads-lab/design-system/components/navigation-progress";

export function AppNavigationProgress() {
	const state = useRouterState();

	return <NavigationProgress isNavigating={state.status === "pending"} />;
}
