import { Outlet, useLocation } from "@tanstack/react-router";
import { useSession } from "@zero-heads-lab/auth/hooks";
import {
	SidebarInset,
	SidebarProvider,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { LayoutProvider } from "@zero-heads-lab/design-system/context/layout";
import { SearchProvider } from "@zero-heads-lab/design-system/context/search";
import { useSidebarData } from "@zero-heads-lab/design-system/hooks/use-sidebar-data";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { getCookie } from "@zero-heads-lab/shared/utils/cookies";
<<<<<<< HEAD
import { SIDEBAR_CONFIG } from "@/data/sidebar-data";
import { AppSidebar } from "@/layout/app-sidebar";
=======
import { SkipToMain } from "@/components/skip-to-main";
import { AppSidebar } from "@/layout/app-sidebar";
import { SearchProvider } from "@/providers/search";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

export function AuthenticatedLayout() {
	const sidebarOpen = getCookie("sidebar_state") !== "false";

<<<<<<< HEAD
	const { sidebarData } = useSidebarData(SIDEBAR_CONFIG);
=======
	const { session } = useSession();
	const location = useLocation({ select: (location) => location.href });
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

	return (
		<LayoutProvider>
			<SearchProvider sidebarData={sidebarData}>
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
			</SearchProvider>
		</LayoutProvider>
	);
}
