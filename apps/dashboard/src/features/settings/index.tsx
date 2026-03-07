import { Outlet } from "@tanstack/react-router";
import {
	AppWindow,
	Bell,
	CreditCard,
	Palette,
	Plug,
	Shield,
	User,
	Users,
} from "lucide-react";
import { MainContent } from "@/layout/main-content";
import {
	type SecondaryNavSection,
	SecondarySidebarTitleHeader,
} from "@/layout/sidebar/secondary-sidebar";

const settingsSections: SecondaryNavSection[] = [
	{
		title: "Account",
		collapsible: false,
		items: [
			{
				id: "profile",
				label: "Profile",
				icon: User,
				path: "/settings",
			},
			{
				id: "notifications",
				label: "Notifications",
				icon: Bell,
				path: "/settings/notifications",
			},
			{
				id: "security",
				label: "Security",
				icon: Shield,
				path: "/settings/security",
			},
		],
	},
	{
		title: "Workspace",
		collapsible: false,
		items: [
			{
				id: "workspace",
				label: "General",
				icon: Users,
				path: "/settings/workspace",
			},
			{
				id: "appearance",
				label: "Appearance",
				icon: Palette,
				path: "/settings/appearance",
			},

			{
				id: "billing",
				label: "Billing",
				icon: CreditCard,
				path: "/settings/billing",
			},
		],
	},
	{
		title: "Connections",
		collapsible: false,
		items: [
			{
				id: "widget",
				label: "Widget",
				icon: AppWindow,
				path: "/settings/widget",
			},
			{
				id: "integrations",
				label: "Integrations",
				icon: Plug,
				path: "/settings/integrations",
			},
		],
	},
];

const SettingsPage = () => {
	return (
		<MainContent
			secondaryHeader={<SecondarySidebarTitleHeader title="Settings" />}
			secondarySections={settingsSections}
		>
			<Outlet />
		</MainContent>
	);
};

export default SettingsPage;
