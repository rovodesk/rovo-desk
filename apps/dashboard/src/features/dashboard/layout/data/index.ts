import {
	Book,
	Funnel,
	LayoutDashboard,
	LifeBuoy,
	ListTodo,
	MapIcon,
	MessagesSquare,
	Package,
	SendIcon,
	Users2,
} from "lucide-react";
import { useMemo } from "react";
import type { SidebarConfig } from "../types";

// 1. Keep the base config static
const BASE_SIDEBAR_CONFIG: SidebarConfig = {
	navGroups: [
		{
			title: "General",
			items: [
				{ title: "Dashboard", url: "/", icon: LayoutDashboard },
				{ title: "Conversations", url: "/conversations", icon: MessagesSquare },
				{ title: "Tasks", url: "/tasks", icon: ListTodo },
				{ title: "My Team", icon: Users2, url: "/my-team" },
				{ title: "Integrations", url: "/integrations", icon: Package },
			],
		},
		{
			title: "Workspace",
			items: [
				{
					title: "Funnel",
					icon: Funnel,
					items: [
						{ title: "My Campaigns", url: "/campaigns" },
						{ title: "Leads", url: "/leads" },
						{ title: "Network", url: "/network" },
					],
				},
				{
					title: "Knowledge Base",
					icon: Book,
					items: [
						{ title: "All Contents", url: "/knowledge-base" },
						{ title: "Editor", url: "/knowledge-base/editor" },
						{ title: "Categories", url: "/knowledge-base/categories" },
						{ title: "Tags", url: "/knowledge-base/tags" },
					],
				},
			],
		},
	],
	footer: [
		{ title: "Help Center", url: "/help-center", icon: LifeBuoy },
		{ title: "Feedback", url: "/feedback", icon: SendIcon },
		{ title: "Roadmap", url: "/roadmap", icon: MapIcon },
	],
};

export function useSidebarData() {
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
		const navGroups = BASE_SIDEBAR_CONFIG.navGroups.map((group) => ({
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
			...BASE_SIDEBAR_CONFIG,
			navGroups,
		};
	}, []);

	return {
		sidebarData,
		// isLoading,
	};
}
