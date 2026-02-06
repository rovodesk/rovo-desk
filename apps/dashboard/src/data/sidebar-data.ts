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
						roles: ["verified"],
					},
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
						roles: [
							"organizationOwner",
							"organizationMember",
							"organizationAdmin",
						],
						resource: "conversations",
						actions: ["list"],
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
						resource: "tasks",
						actions: ["list"],
					},
				},
				{
					title: "My Team",
					icon: SquareUserRound,
					url: "/my-team",
					visibility: {
						roles: ["organizationMember"],
					},
				},
				{
					title: "Integrations",
					url: "/integrations",
					icon: Package,
					visibility: {
						roles: ["organizationOwner", "organizationAdmin"],
						resource: "organization",
						actions: ["update"],
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
						roles: ["organizationOwner", "organizationAdmin"],
						resource: "organization",
						actions: ["read"],
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
						resource: "funnels",
						actions: ["list"],
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
						resource: "folders",
						actions: ["list"],
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
						roles: ["organizationOwner", "organizationAdmin"],
						resource: "organization",
						actions: ["update"],
					},
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
					resource: "tasks",
					actions: ["create"],
				},
			},
			{
				title: "Onboard Enterprise",
				url: "/onboard-enterprise",
				icon: PartyPopper,
				visibility: {
					roles: ["superAdmin", "moderator"],
					resource: "organization",
					actions: ["update"],
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
					resource: "funnels",
					actions: ["create"],
				},
			},
			{
				title: "Create Announcement",
				url: "/announcements/create",
				icon: Megaphone,
				visibility: {
					roles: ["superAdmin", "moderator"],
					resource: "organization",
					actions: ["update"],
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
