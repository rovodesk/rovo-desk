import {
	Book,
	CreditCard,
	FileText,
	Funnel,
	FunnelPlus,
	LayoutDashboard,
	LifeBuoy,
	ListTodo,
	MapIcon,
	Megaphone,
	MessagesSquare,
	Package,
	Package2,
	PartyPopper,
	SendIcon,
	Settings,
	SquareUserRound,
	Users2,
} from "lucide-react";
import type { SidebarConfig } from "@/types/sidebar";

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
					title: "Feature Flags",
					url: "/feature-flags",
					icon: Package2,
					visibility: {
						roles: ["superAdmin", "moderator"],
					},
				},
				{
					title: "Sales",
					url: "/sales",
					icon: MapIcon,
					visibility: {
						roles: ["superAdmin", "moderator"],
					},
				},
				{
					title: "Conversations",
					url: "/conversations",
					icon: MessagesSquare,
					visibility: {
						roles: ["owner", "member", "admin"],
					},
				},
				{
					title: "Tasks",
					url: "/tasks",
					icon: ListTodo,
					visibility: {
						roles: ["owner", "member", "admin"],
					},
				},
				{
					title: "My Team",
					icon: SquareUserRound,
					url: "/my-team",
					visibility: {
						roles: ["member"],
					},
				},
				{
					title: "Integrations",
					url: "/integrations",
					icon: Package,
					visibility: {
						roles: ["owner", "admin"],
					},
				},
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
					visibility: {
						roles: ["owner", "admin"],
					},
				},
				{
					title: "Funnel",
					icon: Funnel,
					items: [
						{ title: "My Campaigns", url: "/campaigns" },
						{ title: "Leads", url: "/leads" },
						{ title: "Network", url: "/network" },
					],
					visibility: {
						roles: ["owner", "admin", "member"],
					},
				},
				{
					title: "Knowledge Base",
					icon: Book,
					items: [
						{ title: "All Contents", url: "/knowledge-base" },
						{ title: "Categories", url: "/knowledge-base/categories" },
						{ title: "Tags", url: "/knowledge-base/tags" },
					],
					visibility: {
						roles: ["owner", "admin", "member"],
					},
				},
			],
		},
		{
			title: "Quick Actions",
			items: [
				{
					title: "Billing",
					url: "/settings/billing",
					icon: CreditCard,
					visibility: {
						roles: ["owner"],
					},
				},
				{
					title: "Settings",
					url: "/settings",
					icon: Settings,
					visibility: {
						roles: ["superAdmin", "moderator", "owner", "admin"],
					},
				},
				{
					title: "Audit Logs",
					url: "/audit-logs",
					icon: FileText,
					visibility: {
						roles: ["owner", "admin"],
					},
				},
			],
		},
	],
	quickLinks: {
		primary: [
			{
				title: "Onboard Enterprise",
				url: "/onboard-enterprise",
				icon: PartyPopper,
				visibility: {
					roles: ["superAdmin", "moderator"],
				},
			},
			{
				title: "Create Campaign",
				url: "/campaigns/create",
				icon: Megaphone,
				visibility: {
					roles: ["owner", "admin", "member"],
				},
			},
		],
		secondary: [
			{
				title: "Create Announcement",
				url: "/announcements/create",
				icon: Megaphone,
				visibility: {
					roles: ["superAdmin", "moderator"],
				},
			},
			{
				title: "Create Funnel",
				url: "/funnel/create",
				icon: FunnelPlus,
				visibility: {
					roles: ["owner", "admin", "member"],
				},
			},
		],
	},
	footer: [
		{ title: "Help Center", url: "/help-center", icon: LifeBuoy },
		{ title: "Feedback", url: "/feedback", icon: SendIcon },
		{ title: "Roadmap", url: "/roadmap", icon: MapIcon },
	],
};
