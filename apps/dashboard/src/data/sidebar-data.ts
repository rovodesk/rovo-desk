<<<<<<< HEAD
import type { SidebarConfig } from "@zero-heads-lab/design-system/types/sidebar";
=======
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import {
	Book,
	CreditCard,
	FileText,
	Funnel,
	LayoutDashboard,
	LifeBuoy,
	ListTodo,
	MapIcon,
	Megaphone,
	MessagesSquare,
	Package,
	PencilRuler,
	SendIcon,
	Settings,
<<<<<<< HEAD
	SquareUserRound,
} from "lucide-react";

//TODO: Configure Sidebar Data Properly
=======
	Users2,
} from "lucide-react";
import type { SidebarConfig } from "@/types/sidebar";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

export const SIDEBAR_CONFIG: SidebarConfig = {
	navGroups: [
		{
			title: "General",
			items: [
<<<<<<< HEAD
				{
					title: "Dashboard",
					url: "/",
					icon: LayoutDashboard,
				},
				{
					title: "Conversations",
					url: "/conversations",
					icon: MessagesSquare,
				},
				{
					title: "Tasks",
					url: "/tasks",
					icon: ListTodo,
				},
				{
					title: "My Team",
					icon: SquareUserRound,
					url: "/my-team",
				},
				{
					title: "Integrations",
					url: "/integrations",
					icon: Package,
				},
=======
				{ title: "Dashboard", url: "/", icon: LayoutDashboard },
				{ title: "Conversations", url: "/conversations", icon: MessagesSquare },
				{ title: "Tasks", url: "/tasks", icon: ListTodo },
				{ title: "My Team", icon: Users2, url: "/my-team" },
				{ title: "Integrations", url: "/integrations", icon: Package },
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
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
		{
			title: "Quick Actions",
			items: [
<<<<<<< HEAD
				{
					title: "Billing",
					url: "/settings/billing",
					icon: CreditCard,
				},
				{
					title: "Settings",
					url: "/settings",
					icon: Settings,
				},
				{
					title: "Audit Logs",
					url: "/audit-logs",
					icon: FileText,
				},
			],
		},
	],
	quickLinks: {
=======
				{ title: "Billing", url: "/settings/billing", icon: CreditCard },
				{ title: "Settings", url: "/settings", icon: Settings },
				{ title: "Audit Logs", url: "/audit-logs", icon: FileText },
			],
		},
	],
	quickLink: {
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
		primary: {
			title: "Create Draft",
			url: "/",
			icon: PencilRuler,
		},
		secondary: {
<<<<<<< HEAD
			title: "Create Campaign",
			url: "/campaigns/create",
=======
			title: "Create Announcement",
			url: "/announcements/create",
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
			icon: Megaphone,
		},
	},
	footer: [
		{ title: "Help Center", url: "/help-center", icon: LifeBuoy },
		{ title: "Feedback", url: "/feedback", icon: SendIcon },
		{ title: "Roadmap", url: "/roadmap", icon: MapIcon },
	],
};
