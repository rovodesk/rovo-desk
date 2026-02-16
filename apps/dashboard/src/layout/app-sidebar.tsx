import { Link } from "@tanstack/react-router";
import { DomainSwitcher } from "@zero-heads-lab/auth/components/domain-switcher";
import { DomainList } from "@zero-heads-lab/auth/components/domains-list";
import { ProfileDropdown } from "@zero-heads-lab/auth/components/profile-dropdown";
import { hasOrganizationAccessRole } from "@zero-heads-lab/auth/helpers";
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
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { useLayout } from "@zero-heads-lab/design-system/context/layout";
import { SIDEBAR_CONFIG } from "@/data/sidebar-data";
import { useSidebarData } from "@/hooks/use-sidebar-data";
import { AppTitle } from "./app-title";
import { SidebarNavSection } from "./nav-section";

export function AppSidebar() {
	const { collapsible, variant } = useLayout();

	const {
		sidebarData,
		role,
		isLoading: isSidebarLoading,
	} = useSidebarData(SIDEBAR_CONFIG);

	const isLoading = isSidebarLoading;
	if (isLoading) {
		return <AppSidebarSkeleton />;
	}

	if (!sidebarData) {
		return null;
	}

	const beforeQuickActions = sidebarData.navGroups.filter(
		(g) => g.title !== "Quick Actions"
	);

	const quickActionsGroup = sidebarData.navGroups.find(
		(g) => g.title === "Quick Actions"
	);

	return (
		<Sidebar
			className="dark:border-r"
			collapsible={collapsible}
			variant={variant}
		>
			<SidebarHeader>
				<AppTitle />
				<SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

				{hasOrganizationAccessRole(role) && role !== "owner" && (
					<DomainSwitcher />
				)}
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenu>
							{Boolean(
								sidebarData.quickLinks?.primary?.length ||
									sidebarData.quickLinks?.secondary?.length
							) && (
								<SidebarMenuItem className="flex items-center gap-2">
									{/* PRIMARY ACTIONS */}
									{sidebarData.quickLinks?.primary?.map((item) => (
										<SidebarMenuButton
											asChild
											className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
											key={item.title}
											tooltip={item.title}
										>
											<Link className="flex items-center gap-2" to={item.url}>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									))}

									{/* SECONDARY ACTIONS */}
									{sidebarData.quickLinks?.secondary?.map((item) => (
										<Button
											asChild
											className="size-8 rounded-md group-data-[collapsible=icon]:opacity-0"
											key={item.title}
											size="icon"
										>
											<Link to={item.url}>
												{item.icon && <item.icon />}
												<span className="sr-only">{item.title}</span>
											</Link>
										</Button>
									))}
								</SidebarMenuItem>
							)}
						</SidebarMenu>
					</SidebarMenu>
				</SidebarGroup>

				{beforeQuickActions.map((group) => (
					<SidebarNavSection key={group.title} {...group} />
				))}
				{hasOrganizationAccessRole(role) && role === "owner" && <DomainList />}
				{quickActionsGroup && (
					<SidebarNavSection
						items={quickActionsGroup.items}
						title={quickActionsGroup.title}
					/>
				)}
			</SidebarContent>

			<SidebarFooter className="flex flex-col gap-8">
				<SidebarMenu>
					{sidebarData.footer.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
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

function AppSidebarSkeleton() {
	const { collapsible, variant } = useLayout();

	return (
		<Sidebar
			className="dark:border-r"
			collapsible={collapsible}
			variant={variant}
		>
			{/* Header */}
			<SidebarHeader className="gap-4">
				<Skeleton className="h-6 w-32" /> {/* App title */}
				<SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
				<Skeleton className="h-8 w-full" /> {/* Domain switcher */}
			</SidebarHeader>

			{/* Content */}
			<SidebarContent>
				{/* Quick actions */}
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem className="flex items-center gap-2">
							<Skeleton className="h-9 flex-1 rounded-md" />
							<Skeleton className="size-8 rounded-md group-data-[collapsible=icon]:opacity-0" />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				{/* Nav groups */}
				{Array.from({ length: 3 }).map((_, groupIndex) => (
					<SidebarGroup className="mt-2" key={groupIndex}>
						<Skeleton className="mb-3 h-4 w-24" /> {/* Group title */}
						<SidebarMenu>
							{Array.from({ length: 4 }).map((_, itemIndex) => (
								<SidebarMenuItem key={itemIndex}>
									<SidebarMenuButton>
										<Skeleton className="size-4 rounded-sm" />
										<Skeleton className="ml-3 h-4 flex-1" />
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>

			{/* Footer */}
			<SidebarFooter className="flex flex-col gap-8">
				<SidebarMenu>
					{Array.from({ length: 3 }).map((_, index) => (
						<SidebarMenuItem key={index}>
							<SidebarMenuButton>
								<Skeleton className="size-4" />
								<Skeleton className="ml-3 h-4 w-20" />
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>

				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton>
							<Skeleton className="h-8 w-full rounded-md" /> {/* Profile */}
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
