import { useSession } from "@zero-heads-lab/auth/hooks";
import { useMemo } from "react";
import {
	ADMIN_SIDEBAR_CONFIG,
	BASE_SIDEBAR_CONFIG,
	USER_SIDEBAR_CONFIG,
} from "@/data/sidebar-data";
import type { SidebarConfig } from "@/types/sidebar";

export function useSidebarData() {
	const { session, isLoading } = useSession();

	// TODO: Implement real data fetching
	const counts = {
		conversations: "3",
		tasks: "12",
	};

	const sidebarData: SidebarConfig | null = useMemo(() => {
		if (!session?.user) return BASE_SIDEBAR_CONFIG;

		// TODO: Choose config based on role
		const baseConfig = session.user.isAdmin
			? ADMIN_SIDEBAR_CONFIG
			: USER_SIDEBAR_CONFIG;

		// Inject dynamic data
		const navGroups = baseConfig.navGroups.map((group) => ({
			...group,
			items: group.items.map((item) => {
				if (item.title === "Conversations") {
					return { ...item, badge: counts.conversations };
				}

				if (item.title === "Tasks") {
					return { ...item, badge: counts.tasks };
				}

				return item;
			}),
		}));

		return {
			...baseConfig,
			navGroups,
		};
	}, [session]);

	return {
		sidebarData,
		isLoading,
		isAdmin: session?.user?.isAdmin,
	};
}
