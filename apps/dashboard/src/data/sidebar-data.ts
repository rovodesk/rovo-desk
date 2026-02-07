import type { SidebarConfig } from "@zero-heads-lab/design-system/types/sidebar";
import {
	Book,
	CreditCard,
	FileText,
	Funnel,
	Inbox,
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
	SquareUserRound,
} from "lucide-react";

export const SIDEBAR_CONFIG: SidebarConfig = {
	navGroups: [
		{
			title: "General",
			items: [
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
				{ title: "Billing", url: "/settings/billing", icon: CreditCard },
				{ title: "Settings", url: "/settings", icon: Settings },
				{ title: "Audit Logs", url: "/audit-logs", icon: FileText },
=======
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
>>>>>>> 41a6b28 (Feat/api (#6))
			],
		},
	],
	quickLinks: {
<<<<<<< HEAD
		primary: [
			{
				title: "Create Draft",
				url: "/",
				icon: PencilRuler,
				visibility: {
					roles: [
						"organizationMember",
						"organizationAdmin",
						"organizationOwner",
					],
				},
			},
			{
				title: "Onboard Enterprise",
				url: "/onboard-enterprise",
				icon: PartyPopper,
				visibility: {
					roles: ["superAdmin", "moderator"],
				},
			},
		],
		secondary: [
			{
				title: "Inbox",
				url: "/inbox",
				icon: Inbox,
				visibility: {
					roles: [
						"organizationMember",
						"organizationAdmin",
						"organizationOwner",
					],
				},
			},
			{
				title: "Create Announcement",
				url: "/announcements/create",
				icon: Megaphone,
				visibility: {
					roles: ["superAdmin", "moderator"],
				},
			},
		],
=======
		primary: {
			title: "Create Draft",
			url: "/",
			icon: PencilRuler,
		},
		secondary: {
			title: "Create Campaign",
			url: "/campaigns/create",
			icon: Megaphone,
		},
>>>>>>> 41a6b28 (Feat/api (#6))
	},
	footer: [
		{ title: "Help Center", url: "/help-center", icon: LifeBuoy },
		{ title: "Feedback", url: "/feedback", icon: SendIcon },
		{ title: "Roadmap", url: "/roadmap", icon: MapIcon },
	],
};
