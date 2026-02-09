import { determineAccessRole } from "@zero-heads-lab/auth/helpers";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { useMemo } from "react";
import { filterSidebarConfig } from "@/lib/naviagtion-filters";
import type { SidebarConfig } from "@/types/sidebar";

interface BadgeCounts {
	conversations?: number;
	tasks?: number;
	notifications?: number;
}

// DYNAMICALLY INJECT BADGES TO ITEMS
function injectBadges(
	config: SidebarConfig,
	counts: BadgeCounts
): SidebarConfig {
	const navGroups = config.navGroups.map((group) => ({
		...group,
		items: group.items.map((item) => {
			// Match by title and inject corresponding count
			if (item.title === "Conversations" && counts.conversations) {
				return { ...item, badge: counts.conversations };
			}

			if (item.title === "Tasks" && counts.tasks) {
				return { ...item, badge: counts.tasks };
			}

			if (item.title === "Notifications" && counts.notifications) {
				return { ...item, badge: counts.notifications };
			}

			return item;
		}),
	}));

	return {
		...config,
		navGroups,
	};
}

export function useSidebarData(config: SidebarConfig) {
	const { session, isLoading: sessionLoading } = useSession();

	const counts: BadgeCounts = {
		conversations: 3,
		tasks: 12,
		notifications: 12,
	};
	const role = determineAccessRole(session?.user?.role);

	// Filter the provided Sidebar Items based on role, permissions
	const sidebarData = useMemo(() => {
		const sidebar = filterSidebarConfig(config, role);
		return injectBadges(sidebar, counts);
	}, [config, role]);

	return {
		sidebarData,
		role,
		isLoading: sessionLoading,
	};
}
