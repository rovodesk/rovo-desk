import type { SidebarConfig } from "../types/sidebar";
import { useMemo } from "react";

interface BadgeCounts {
	conversations?: number;
	tasks?: number;
	notifications?: number;
}

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


	const counts: BadgeCounts = {
		conversations: 3,
		tasks: 12,
		notifications: 12,
	};

	const sidebarData = useMemo(() => {
		const sidebar = config;

		return injectBadges(sidebar, counts);
	}, [config]);

	return {
		sidebarData,
		isLoading: false, // Implement Loading
	};
}
