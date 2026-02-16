import { useOnboarding } from "@onboardjs/react";
import { Outlet } from "@tanstack/react-router";
import Loader from "@zero-heads-lab/design-system/components/loader";
import {
	SidebarInset,
	SidebarProvider,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { LayoutProvider } from "@zero-heads-lab/design-system/context/layout";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { getCookie } from "@zero-heads-lab/shared/utils/cookies";
import { SearchProvider } from "@/providers/search";
import { AppSidebar } from "./app-sidebar";

export function AuthenticatedLayout() {
	const sidebarOpen = getCookie("sidebar_state") !== "false";

	const { loading } = useOnboarding();

	if (loading.isHydrating) {
		return <Loader title="Loading..." />;
	}

	// if (!state?.isCompleted) {
	// 	return <OnboardingFlow />;
	// }

	return (
		<SearchProvider>
			<LayoutProvider>
				<SidebarProvider defaultOpen={sidebarOpen}>
					<AppSidebar />
					<SidebarInset
						className={cn(
							// Set content container, so we can use container queries
							"@container/content",

							// If layout is fixed, set the height
							// to 100svh to prevent overflow
							"has-data-[layout=fixed]:h-svh",

							// If layout is fixed and sidebar is inset,
							// set the height to 100svh - spacing (total margins) to prevent overflow
							"peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]"
						)}
					>
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
			</LayoutProvider>
		</SearchProvider>
	);
}
