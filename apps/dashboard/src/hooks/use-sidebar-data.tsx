import { useMemo } from "react";
import type { SidebarConfig } from "@/types/sidebar";

export function useSidebarData(data: SidebarConfig) {
	// const { data: userData, isLoading } = useQuery(authQueries.memberRole());

	// const role = userData?.role;

	// // Logic: Add "My Team" to Workspace group if user is NOT an owner
	// if (role && role !== "owner") {
	// 	const workspaceGroup = navGroups.find((g) => g.title === "Workspace");

	// 	if (workspaceGroup) {
	// 		workspaceGroup.items.push({
	// 			title: "My Team",
	// 			url: "/my-team",
	// 			icon: Users, // Using Lucide Users icon
	// 		});
	// 	}
	// }
	// Example: const { data: counts } = useQuery(notificationsQueries.unread());
	const counts = {
		conversations: "3",
		tasks: "12",
	};

	const sidebarData = useMemo(() => {
		// Map through navGroups to inject badges based on item title or URL
		const navGroups = data.navGroups.map((group) => ({
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
			...data,
			navGroups,
		};
	}, [data]);

	return {
		sidebarData,
		// isLoading,
	};
}
