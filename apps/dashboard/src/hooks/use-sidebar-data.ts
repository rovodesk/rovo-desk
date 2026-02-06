import type { AuthRole } from "@zero-heads-lab/auth/access-control";
import { determineAccessRole } from "@zero-heads-lab/auth/helpers";
import { useMemberRole, useSession } from "@zero-heads-lab/auth/hooks";
import { useMemo } from "react";
import { filterSidebarConfig } from "@/lib/naviagtion-filters";
import type { SidebarConfig } from "@/types/sidebar";
import { useUserPermissions } from "./use-user-permissions";

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
	const { memberRole, isLoading: memberRoleLoading } = useMemberRole();

	/**
	 * Prioritize Member Role if we are in an organization context.
	 * Otherwise fall back to the platform/user role.
	 */
	const role: AuthRole = useMemo(() => {
		if (memberRole) return determineAccessRole(memberRole);
		return determineAccessRole(session?.user?.role);
	}, [memberRole, session?.user?.role]);

	const { permissions, isLoading: authLoading } = useUserPermissions(
		role,
		config
	);

	const counts: BadgeCounts = {
		conversations: 3,
		tasks: 12,
		notifications: 12,
	};

	// Filter the provided Sidebar Items based on role, permissions
	const sidebarData = useMemo(() => {
		if (!session?.user) return null;

		const sidebar = filterSidebarConfig(config, permissions);

		return injectBadges(sidebar, counts);
	}, [config, permissions, session]);

	return {
		sidebarData,
		role,
		isLoading: sessionLoading || authLoading || memberRoleLoading,
	};
}
