import { Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@zero-heads-lab/design-system/components/ui/sidebar";
import { getCookie, setCookie } from "@zero-heads-lab/shared/utils";
import { createContext, useContext, useEffect, useState } from "react";
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

	hydrated: boolean;
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
	const [hydrated, setHydrated] = useState(false);

	const [activeSecondarySidebar, setActiveSecondarySidebar] = useState("");
	const [activeRightSidebar, setActiveRightSidebar] = useState("");

	const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(false);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const [pinnedSecondarySidebar, setPinnedSecondarySidebar] = useState(false);

	// Hydration step
	useEffect(() => {
		const cookie = getCookie("secondary-sidebar-state");
		setPinnedSecondarySidebar(cookie === "open");
		setHydrated(true);
	}, []);

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

		hydrated,
	};

	// Loading state during hydration
	if (!hydrated) {
		return (
			<div className="flex h-dvh w-full items-center justify-center">
				<div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
			</div>
		);
	}

	return (
		<div className="flex max-h-dvh w-full overflow-hidden">
			<DashboardLayoutContext.Provider value={value}>
				<SidebarProvider open={false}>
					<div className="flex h-screen w-full overflow-hidden">
						<PrimarySidebar />
						<Outlet />
					</div>
				</SidebarProvider>
			</DashboardLayoutContext.Provider>
		</div>
	);
}
