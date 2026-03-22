import { Outlet } from "@tanstack/react-router";
import { User, Users, Users2 } from "lucide-react";
import { MainContent } from "@/layout/main-content";
import {
	type SecondaryNavSection,
	SecondarySidebarTitleHeader,
} from "@/layout/sidebar/secondary-sidebar";

const secondaryNavigation: SecondaryNavSection[] = [
	{
		items: [
			{
				id: "users",
				label: "Users",
				icon: User,
				path: "/user-management",
			},
			{
				id: "organizations",
				label: "Organizations",
				icon: Users,
				path: "/user-management/organizations",
			},
			{
				id: "beta",
				label: "Beta",
				icon: Users2,
				path: "/user-management/beta",
			},
		],
	},
];

const UserManagement = () => {
	return (
		<MainContent
			secondaryHeader={<SecondarySidebarTitleHeader title="User Management" />}
			secondarySections={secondaryNavigation}
		>
			<Outlet />
		</MainContent>
	);
};

export default UserManagement;
