import { Link } from "@tanstack/react-router";
import { DomainSwitcher } from "@zero-heads-lab/auth/components/domain-switcher";
import { ProfileDropdown } from "@zero-heads-lab/auth/components/profile-dropdown";
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
	SidebarSeparator,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { useLayout } from "@zero-heads-lab/design-system/context/layout";
import { SIDEBAR_CONFIG } from "@/data/sidebar-data";
import { useSidebarData } from "@/hooks/use-sidebar-data";
import { AppTitle } from "./app-title";
import { SidebarNavSection } from "./nav-section";

export function AppSidebar() {
	const { collapsible, variant } = useLayout();

	const { sidebarData } = useSidebarData(SIDEBAR_CONFIG);

	return (
		<Sidebar
			className="dark:border-r"
			collapsible={collapsible}
			variant={variant}
		>
			<SidebarHeader>
				<AppTitle />
				<SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
				<DomainSwitcher />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{sidebarData.quickLink && (
							<SidebarMenuItem className="flex items-center gap-2">
								{sidebarData.quickLink?.primary && (
									<SidebarMenuButton
										className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
										tooltip={sidebarData.quickLink?.primary?.title}
									>
										{sidebarData.quickLink.primary?.icon && (
											<sidebarData.quickLink.primary.icon />
										)}
										<span>{sidebarData.quickLink.primary?.title}</span>
									</SidebarMenuButton>
								)}

								{sidebarData.quickLink?.secondary && (
									<Button
										asChild
										className="size-8 rounded-md group-data-[collapsible=icon]:opacity-0"
										size="icon"
									>
										<Link to={sidebarData.quickLink?.secondary?.url}>
											{sidebarData.quickLink.secondary?.icon && (
												<sidebarData.quickLink.secondary.icon />
											)}
											<span className="sr-only">
												{sidebarData.quickLink.secondary?.title}
											</span>
										</Link>
									</Button>
								)}
							</SidebarMenuItem>
						)}
					</SidebarMenu>
				</SidebarGroup>
				{sidebarData.navGroups.map((group) => (
					<SidebarNavSection key={group.title} {...group} />
				))}
			</SidebarContent>

			<SidebarFooter className="flex flex-col gap-8">
				<SidebarMenu>
					{sidebarData.footer.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className="bg-transparent! hover:bg-sidebar-accent!"
							>
								<a href={item.url}>
									{item.icon && (
										<>
											<item.icon />
											<span className="sr-only">{item.title}</span>
										</>
									)}
									{item.title}
								</a>
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
