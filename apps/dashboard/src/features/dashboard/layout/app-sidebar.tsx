import { Link } from "@tanstack/react-router";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { useLayout } from "@zero-heads-lab/design-system/context/layout";
import { CirclePlusIcon, MailIcon } from "lucide-react";
import { SIDEBAR_CONFIG } from "./data";
// import { AppTitle } from "./app-title";
import { DomainSwitcher } from "./domain-switcher";
import { SidebarNavSection } from "./nav-section";
import { ProfileDropdown } from "./profile-dropdown";

export function AppSidebar() {
	const { collapsible, variant } = useLayout();

	return (
		<Sidebar
			className="dark:border-r"
			collapsible={collapsible}
			variant={variant}
		>
			<SidebarHeader>
				{/* <AppTitle /> */}
				<DomainSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem className="flex items-center gap-2">
							<SidebarMenuButton
								className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
								tooltip="Knowledge Draft"
							>
								<CirclePlusIcon />
								<span>Create Draft</span>
							</SidebarMenuButton>
							<Button
								className="size-8 rounded-md group-data-[collapsible=icon]:opacity-0"
								size="icon"
							>
								<MailIcon />
								<span className="sr-only">Inbox</span>
							</Button>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
				{SIDEBAR_CONFIG.navGroups.map((group) => (
					<SidebarNavSection key={group.title} {...group} />
				))}
				{/* User's Domains */}
				{/* <NavDomainsList /> */}
			</SidebarContent>
			<SidebarFooter className="flex flex-col gap-8">
				<SidebarMenu>
					{SIDEBAR_CONFIG.footer.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className="bg-transparent! hover:bg-sidebar-accent!"
							>
								<Link to={item.url}>
									{item.icon && (
										<>
											<item.icon />
											<span className="sr-only">{item.title}</span>
										</>
									)}
									{item.title}
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<ProfileDropdown />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
