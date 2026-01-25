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
} from "lucide-react";
import type { SidebarConfig } from "../types";

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
					badge: "3",
					icon: MessagesSquare,
				},
				{
					title: "Tasks",
					url: "/tasks",
					badge: "2",
					icon: ListTodo,
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
						{
							title: "My Campaigns",
							url: "/campaigns",
						},
						{
							title: "Leads",
							url: "/leads",
						},
						{
							title: "Network",
							url: "/network",
						},
					],
				},
				{
					title: "Knowledge Base",
					icon: Book,
					items: [
						{
							title: "All Contents",
							url: "/knowledge-base",
						},
						{
							title: "Editor",
							url: "/knowledge-base/editor",
						},
						{
							title: "Categories",
							url: "/knowledge-base/categories",
						},
						{
							title: "Tags",
							url: "/knowledge-base/tags",
						},
					],
				},
			],
		},
	],
	footer: [
		{
			title: "Help Center",
			url: "/help-center",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "/feedback",
			icon: SendIcon,
		},
		{
			title: "Roadmap",
			url: "/roadmap",
			icon: MapIcon,
		},
	],
};
