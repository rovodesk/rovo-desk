import { Outlet } from "@tanstack/react-router";
import {
	Bell,
	CreditCard,
	Globe,
	LifeBuoy,
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
				id: "general",
				label: "General",
				icon: Globe,
				path: "/settings/general",
			},
			{
				id: "appearance",
				label: "Appearance",
				icon: Palette,
				path: "/settings/appearance",
			},
			{
				id: "workspace",
				label: "Workspace",
				icon: Users,
				path: "/settings/workspace",
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
				id: "apps",
				label: "Apps",
				icon: LifeBuoy,
				path: "/settings/apps",
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
