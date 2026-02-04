import type { AuthRole } from "@zero-heads-lab/auth/access-control";
import { isAuthRole } from "@zero-heads-lab/auth/helpers";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { useMemo } from "react";
import { filterSidebarConfig } from "@/lib/naviagtion-filters";
import type { SidebarConfig } from "@/types/sidebar";
import { useSidebarPermissions } from "./use-sidebar-permissions";

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
	const { session, isLoading: sessionLoading } = useSession();

	// ✅ Explicit fallback role
	const rawRole = session?.user?.role;
	const role: AuthRole = isAuthRole(rawRole) ? rawRole : "anonymous";

	const { permissions, isLoading: authLoading } = useSidebarPermissions(role);

	const counts: BadgeCounts = {
		conversations: 3,
		tasks: 12,
		notifications: 12,
	};

	const sidebarData = useMemo(() => {
		if (!session?.user) return config;

		const sidebar = filterSidebarConfig(config, role, permissions);

		return injectBadges(sidebar, counts);
	}, [config, role, permissions, session]);

	return {
		sidebarData,
		role,
		isLoading: sessionLoading || authLoading,
	};
}
