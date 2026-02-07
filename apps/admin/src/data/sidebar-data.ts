import type { SidebarConfig } from "@zero-heads-lab/design-system/types/sidebar";
import {
	DoorClosedLockedIcon,
	FileText,
	Flag,
	LayoutDashboard,
	Leaf,
	LifeBuoy,
	MapIcon,
	Megaphone,
	PartyPopper,
	SendIcon,
	Settings,
	Sparkles,
	UserSquare2,
	Users2,
} from "lucide-react";

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
				},
				{
					title: "Sales",
					url: "/sales",
					icon: Sparkles,
				},
				{
					title: "Leads",
					url: "/leads",
					icon: Leaf,
				},
				{
					title: "Feature Flags",
					icon: Flag,
					url: "/feature-flags",
				},
			],
		},
		{
			title: "User Management",
			items: [
				{
					title: "Users",
					icon: UserSquare2,
					items: [
						{ title: "Overview", url: "/users" },
						{ title: "All Users", url: "/users/all" },
						{ title: "Create User", url: "/users/create" },
					],
				},
				{
					title: "Organizations",
					icon: Users2,
					items: [
						{ title: "Overview", url: "/organizations" },
						{ title: "All Organizations", url: "/organizations/all" },
						{ title: "All Members", url: "/organizations/members" },
						{ title: "All Teams", url: "/organizations/teams" },
					],
				},
				{
					title: "Access Control",
					icon: DoorClosedLockedIcon,
					items: [
						{ title: "Roles", url: "/roles" },
						{ title: "Permissions", url: "/roles/permissions" },
						{ title: "Audit Logs", url: "/roles/audit-logs" },
					],
				},
			],
		},
		{
			title: "Quick Actions",
			items: [
				{
					title: "Settings",
					url: "/settings",
					icon: Settings,
				},
				{
					title: "Logs",
					url: "/logs",
					icon: FileText,
				},
			],
		},
	],
	quickLinks: {
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
	footer: [
		{ title: "Help Center", url: "/help-center", icon: LifeBuoy },
		{ title: "Feedbacks", url: "/feedbacks", icon: SendIcon },
		{ title: "Roadmap", url: "/roadmap", icon: MapIcon },
	],
};
