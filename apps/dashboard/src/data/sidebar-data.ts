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
	PartyPopper,
	PencilRuler,
	SendIcon,
	Settings,
<<<<<<< HEAD
<<<<<<< HEAD
	SquareUserRound,
} from "lucide-react";

//TODO: Configure Sidebar Data Properly
=======
=======
	SquareUserRound,
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
	Users2,
} from "lucide-react";
import type { SidebarConfig } from "@/types/sidebar";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

const sidebarFooter = [
	{ title: "Help Center", url: "/help-center", icon: LifeBuoy },
	{ title: "Feedback", url: "/feedback", icon: SendIcon },
	{ title: "Roadmap", url: "/roadmap", icon: MapIcon },
];

export const BASE_SIDEBAR_CONFIG: SidebarConfig = {
	navGroups: [
		{
			title: "General",
			items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
		},
	],
	quickLink: {
		primary: {
			title: "Create Draft",
			url: "/",
			icon: PencilRuler,
		},
		secondary: {
			title: "Create Announcement",
			url: "/announcements/create",
			icon: Megaphone,
		},
	},
	footer: sidebarFooter,
};

export const USER_SIDEBAR_CONFIG: SidebarConfig = {
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
				{ title: "My Team", icon: SquareUserRound, url: "/my-team" },
				{ title: "Integrations", url: "/integrations", icon: Package },
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
			],
		},
		{
			title: "Workspace",
			items: [
				{
					title: "Manage Workspace",
					icon: Users2,
					items: [
						{ title: "Overview", url: "/workspace" },
						{ title: "Members", url: "/workspace/members" },
						{ title: "Teams", url: "/workspace/teams" },
						{ title: "Customise", url: "/workspace/customise" },
					],
				},
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
	footer: sidebarFooter,
};

export const ADMIN_SIDEBAR_CONFIG: SidebarConfig = {
	navGroups: [
		{
			title: "General",
			items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
		},
		{
			title: "User Management",
			items: [
				{
					title: "Organizations",
					icon: Users2,
					items: [
						{ title: "All Organizations", url: "/organizations" },
						{ title: "Create Organization", url: "/organizations/create" },
					],
				},
				{
					title: "Users",
					icon: Users2,
					items: [
						{ title: "All Users", url: "/users" },
						{ title: "Create User", url: "/users/create" },
					],
				},
				{
					title: "Teams",
					icon: Users2,
					items: [
						{ title: "All Teams", url: "/teams" },
						{ title: "Create Team", url: "/teams/create" },
					],
				},
			],
		},
	],
	quickLink: {
		primary: {
			title: "Onboard Enterprise",
			url: "/onboard-enterprise",
			icon: PartyPopper,
		},
		secondary: {
			title: "Create Announcement",
			url: "/announcements/create",
			icon: Megaphone,
		},
	},

	footer: sidebarFooter,
};
