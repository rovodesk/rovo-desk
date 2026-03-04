import { Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@zero-heads-lab/design-system/components/ui/sidebar";
import { getCookie, setCookie } from "@zero-heads-lab/shared/utils";
import { createContext, useContext, useState } from "react";
import { PrimarySidebar } from "@/layout/sidebar/primary-sidebar";

interface DashboardLayoutContextType {
	secondarySidebarOpen: boolean;
	setSecondarySidebarOpen: (open: boolean) => void;
	activeSecondarySidebar: string;
	setActiveSecondarySidebar: (id: string) => void;

	pinnedSecondarySidebar: boolean;
	setPinnedSecondarySidebar: (pinned: boolean) => void;

	rightSidebarOpen: boolean;
	setRightSidebarOpen: (open: boolean) => void;
	activeRightSidebar: string;
	setActiveRightSidebar: (id: string) => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | null>(
	null
);

export function useDashboardLayout() {
	const ctx = useContext(DashboardLayoutContext);
	if (!ctx)
		throw new Error("useDashboardLayout must be used within DashboardLayout");
	return ctx;
}

export function DashboardLayout() {
	const [activeSecondarySidebar, setActiveSecondarySidebar] = useState("");
	const [activeRightSidebar, setActiveRightSidebar] = useState("");

	const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(false);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const [pinnedSecondarySidebar, setPinnedSecondarySidebar] = useState<boolean>(
		getCookie("secondary-sidebar-state") === "open"
	);

	const value: DashboardLayoutContextType = {
		pinnedSecondarySidebar,
		setPinnedSecondarySidebar,
		secondarySidebarOpen,
		setSecondarySidebarOpen: (open: boolean) => {
			setSecondarySidebarOpen(open);
			setCookie("secondary-sidebar-state", open ? "open" : "closed");
		},
		activeSecondarySidebar,
		setActiveSecondarySidebar,
		rightSidebarOpen,
		setRightSidebarOpen,
		activeRightSidebar,
		setActiveRightSidebar,
	};

	return (
		<div className="flex max-h-dvh w-full overflow-hidden">
			<DashboardLayoutContext.Provider value={value}>
				<SidebarProvider open={false}>
					<div className="flex h-screen w-full overflow-hidden">
						{/* Primary Sidebar (always visible) */}
						<PrimarySidebar />

						<Outlet />
					</div>
				</SidebarProvider>
			</DashboardLayoutContext.Provider>
		</div>
	);
}
