<<<<<<< HEAD
<<<<<<< HEAD
import { DomainSwitcher } from "@zero-heads-lab/auth/components/domain-switcher";
import { ProfileDropdown } from "@zero-heads-lab/auth/components/profile-dropdown";
=======
import { Link } from "@tanstack/react-router";
import { DomainSwitcher } from "@zero-heads-lab/auth/components/domain-switcher";
import { ProfileDropdown } from "@zero-heads-lab/auth/components/profile-dropdown";
import { hasPlatformAccessRole } from "@zero-heads-lab/auth/helpers";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
import { DomainSwitcher } from "@zero-heads-lab/auth/components/domain-switcher";
import { ProfileDropdown } from "@zero-heads-lab/auth/components/profile-dropdown";
>>>>>>> 41a6b28 (Feat/api (#6))
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
<<<<<<< HEAD
<<<<<<< HEAD
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { useLayout } from "@zero-heads-lab/design-system/context/layout";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 41a6b28 (Feat/api (#6))
import { useSidebarData } from "@zero-heads-lab/design-system/hooks/use-sidebar-data";
import { AppTitle } from "@zero-heads-lab/design-system/layout/app-title";
import { SIDEBAR_CONFIG } from "@/data/sidebar-data";
import { Button } from "../../../../packages/design-system/components/ui/button";
<<<<<<< HEAD
=======
=======
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
import { useLayout } from "@zero-heads-lab/design-system/context/layout";
=======
import { SIDEBAR_CONFIG } from "@/data/sidebar-data";
>>>>>>> 36d2c52 (feat: Implement robust access control and multi-session management with new server-side configurations and dashboard sidebar filtering.)
import { useSidebarData } from "@/hooks/use-sidebar-data";
import { AppTitle } from "./app-title";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> 41a6b28 (Feat/api (#6))
import { SidebarNavSection } from "./nav-section";

export function AppSidebar() {
	const { collapsible, variant } = useLayout();
<<<<<<< HEAD
<<<<<<< HEAD
	const { sidebarData, isLoading } = useSidebarData(SIDEBAR_CONFIG);

<<<<<<< HEAD
	if (isLoading) {
		return <AppSidebarSkeleton />;
	}
=======

<<<<<<< HEAD
	const { sidebarData } = useSidebarData(SIDEBAR_CONFIG);
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
	const { sidebarData, isLoading } = useSidebarData();

	if (isLoading) return <AppSidebarSkeleton />;
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
=======
	const { sidebarData, role, isLoading } = useSidebarData(SIDEBAR_CONFIG);
=======
	const { sidebarData, isLoading } = useSidebarData(SIDEBAR_CONFIG);
>>>>>>> 41a6b28 (Feat/api (#6))

	if (isLoading) {
		return <AppSidebarSkeleton />;
	}

<<<<<<< HEAD
	console.log(role);
>>>>>>> 36d2c52 (feat: Implement robust access control and multi-session management with new server-side configurations and dashboard sidebar filtering.)

=======
>>>>>>> 41a6b28 (Feat/api (#6))
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
<<<<<<< HEAD
<<<<<<< HEAD
				{sidebarData.quickLinks && (
					<SidebarGroup>
						<SidebarMenu>
							<SidebarMenuItem className="flex items-center gap-2">
								{/* PRIMARY ACTIONS */}
								{sidebarData.quickLinks.primary && (
									<SidebarMenuButton
										asChild
										className="min-w-8 bg-primary hover:bg-primary/90"
										tooltip={sidebarData.quickLinks.primary.title}
									>
										<a
											className="flex items-center gap-2"
											href={sidebarData.quickLinks.primary.url}
										>
											{sidebarData.quickLinks.primary.icon && (
												<sidebarData.quickLinks.primary.icon />
											)}
											<span>{sidebarData.quickLinks.primary.title}</span>
										</a>
									</SidebarMenuButton>
								)}

								{/* SECONDARY ACTIONS */}
								{sidebarData.quickLinks.secondary && (
=======
				<SidebarGroup>
					<SidebarMenu>
=======
				{sidebarData.quickLinks && (
					<SidebarGroup>
>>>>>>> 41a6b28 (Feat/api (#6))
						<SidebarMenu>
							<SidebarMenuItem className="flex items-center gap-2">
								{/* PRIMARY ACTIONS */}
								{sidebarData.quickLinks.primary && (
									<SidebarMenuButton
										asChild
										className="min-w-8 bg-primary hover:bg-primary/90"
										tooltip={sidebarData.quickLinks.primary.title}
									>
										<a
											className="flex items-center gap-2"
											href={sidebarData.quickLinks.primary.url}
										>
											{sidebarData.quickLinks.primary.icon && (
												<sidebarData.quickLinks.primary.icon />
											)}
											<span>{sidebarData.quickLinks.primary.title}</span>
										</a>
									</SidebarMenuButton>
								)}

<<<<<<< HEAD
<<<<<<< HEAD
								{sidebarData.quickLink?.secondary && (
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
								{/* SECONDARY ACTIONS */}
								{sidebarData.quickLinks.secondary && (
>>>>>>> 41a6b28 (Feat/api (#6))
									<Button
										asChild
										className="size-8 rounded-md group-data-[collapsible=icon]:opacity-0"
										size="icon"
									>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 41a6b28 (Feat/api (#6))
										<a href={sidebarData.quickLinks.secondary.url}>
											{sidebarData.quickLinks.secondary.icon && (
												<sidebarData.quickLinks.secondary.icon />
											)}
											<span className="sr-only">
												{sidebarData.quickLinks.secondary.title}
											</span>
										</a>
									</Button>
								)}
							</SidebarMenuItem>
<<<<<<< HEAD
						</SidebarMenu>
					</SidebarGroup>
				)}

=======
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
=======
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
>>>>>>> 36d2c52 (feat: Implement robust access control and multi-session management with new server-side configurations and dashboard sidebar filtering.)
					</SidebarMenu>
				</SidebarGroup>
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
						</SidebarMenu>
					</SidebarGroup>
				)}

>>>>>>> 41a6b28 (Feat/api (#6))
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
<<<<<<< HEAD
<<<<<<< HEAD
								className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
							>
								<a className="flex items-center gap-2" href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
=======
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
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
								className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
							>
								<a className="flex items-center gap-2" href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
>>>>>>> 41a6b28 (Feat/api (#6))
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
<<<<<<< HEAD
<<<<<<< HEAD

				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
						>
=======
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======

				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
						>
>>>>>>> 41a6b28 (Feat/api (#6))
							<ProfileDropdown />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

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
<<<<<<< HEAD
=======
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
