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
	Package2,
	PartyPopper,
	PencilRuler,
	SendIcon,
	Settings,
	SquareUserRound,
	Users2,
} from "lucide-react";
import type { SidebarConfig } from "@/types/sidebar";

//TODO: Configure Sidebar Data Properly

export const SIDEBAR_CONFIG: SidebarConfig = {
	navGroups: [
		{
			title: "General",
			items: [
				{
					title: "Dashboard",
					url: "/",
					icon: LayoutDashboard,
					visibility: {
						roles: ["verified", "superAdmin"],
					},
				},
				{
					title: "Feature Flags",
					url: "/feature-flags",
					icon: Package2,
					visibility: {
						roles: ["superAdmin"],
					},
				},
				{
					title: "Sales",
					url: "/sales",
					icon: MapIcon,
					visibility: {
						roles: ["superAdmin"],
					},
				},
				{
					title: "Conversations",
					url: "/conversations",
					icon: MessagesSquare,
					visibility: {
						roles: [
							"organizationOwner",
							"organizationMember",
							"organizationAdmin",
						],
					},
				},
				{
					title: "Tasks",
					url: "/tasks",
					icon: ListTodo,
					visibility: {
						roles: [
							"organizationOwner",
							"organizationMember",
							"organizationAdmin",
						],
					},
				},
				{
					title: "My Team",
					icon: SquareUserRound,
					url: "/my-team",
					visibility: {
						roles: [
							"organizationOwner",
							"organizationMember",
							"organizationAdmin",
						],
					},
				},
				{
					title: "Integrations",
					url: "/integrations",
					icon: Package,
					visibility: {
						roles: [
							"organizationOwner",
							"organizationMember",
							"organizationAdmin",
						],
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
						roles: [
							"organizationOwner",
							"organizationMember",
							"organizationAdmin",
						],
					},
				},
				{
					title: "Organizations",
					icon: Users2,
					items: [
						{
							title: "All Organizations",
							url: "/organizations",
						},
						{
							title: "Create Organization",
							url: "/organizations/create",
						},
					],
					visibility: {
						roles: ["superAdmin"],
					},
				},
				{
					title: "Users",
					icon: Users2,
					items: [
						{ title: "All Users", url: "/users" },
						{ title: "Create User", url: "/users/create" },
					],
					visibility: {
						roles: ["superAdmin"],
					},
				},
				{
					title: "Teams",
					icon: Users2,
					items: [
						{ title: "All Teams", url: "/teams" },
						{ title: "Create Team", url: "/teams/create" },
					],
					visibility: {
						roles: ["superAdmin"],
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
						roles: [
							"organizationMember",
							"organizationAdmin",
							"organizationOwner",
						],
					},
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
					visibility: {
						roles: [
							"organizationMember",
							"organizationAdmin",
							"organizationOwner",
						],
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
					visibility: { roles: ["organizationOwner", "organizationAdmin"] },
				},
				{
					title: "Settings",
					url: "/settings",
					icon: Settings,
					visibility: {
						roles: [
							"superAdmin",
							"moderator",
							"organizationOwner",
							"organizationAdmin",
						],
					},
				},
				{
					title: "Audit Logs",
					url: "/audit-logs",
					icon: FileText,
					visibility: {
						roles: [
							"superAdmin",
							"moderator",
							"organizationOwner",
							"organizationAdmin",
						],
					},
				},
			],
		},
	],
	quickLinks: {
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
				title: "Create Campaign",
				url: "/campaigns/create",
				icon: Megaphone,
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
	},
	footer: [
		{ title: "Help Center", url: "/help-center", icon: LifeBuoy },
		{ title: "Feedback", url: "/feedback", icon: SendIcon },
		{ title: "Roadmap", url: "/roadmap", icon: MapIcon },
	],
};
