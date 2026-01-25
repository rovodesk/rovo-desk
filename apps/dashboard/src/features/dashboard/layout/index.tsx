import { Outlet } from "@tanstack/react-router";
import {
	SidebarInset,
	SidebarProvider,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { LayoutProvider } from "@zero-heads-lab/design-system/context/layout";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { getCookie } from "@zero-heads-lab/shared/utils/cookies";
import { SkipToMain } from "@/components/skip-to-main";
import { SearchProvider } from "@/providers/search";
import { AppSidebar } from "./app-sidebar";

interface AuthenticatedLayoutProps {
	children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
	const sidebarOpen = getCookie("sidebar_state") !== "false";

	return (
		<LayoutProvider>
			<SearchProvider>
				<SidebarProvider defaultOpen={sidebarOpen}>
					<SkipToMain />
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
						{children ?? <Outlet />}
					</SidebarInset>
				</SidebarProvider>
			</SearchProvider>
		</LayoutProvider>
	);
}
