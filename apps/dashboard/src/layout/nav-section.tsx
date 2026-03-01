import { Link, useLocation } from "@tanstack/react-router";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@zero-heads-lab/design-system/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zero-heads-lab/design-system/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@zero-heads-lab/design-system/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type {
	NavCollapsible,
	NavGroup as NavGroupProps,
	NavItem,
	NavLink,
} from "@/types/sidebar";

function SidebarNavBadge({ children }: { children: ReactNode }) {
	return (
		<Badge className="rounded-full px-1 py-0 font-semibold text-xs">
			{children}
		</Badge>
	);
}

function SidebarNavSection({ title, items }: NavGroupProps) {
	const { state, isMobile } = useSidebar();
	const href = useLocation({ select: (location) => location.href });

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const key = `${item.title}-${item.url}`;

					if (!item.items) {
						return (
							<SidebarNavItem href={href} item={item as NavLink} key={key} />
						);
					}

					if (state === "collapsed" && !isMobile) {
						return (
							<SidebarNavCollapsible
								collapsed
								href={href}
								item={item}
								key={key}
							/>
						);
					}

					return <SidebarNavCollapsible href={href} item={item} key={key} />;
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function SidebarNavItem({ item, href }: { item: NavLink; href: string }) {
	const { setOpenMobile } = useSidebar();

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
				isActive={isActiveRoute(href, item)}
				onClick={() => setOpenMobile(false)}
				tooltip={item.title}
			>
				<Link to={item.url}>
					{item.icon && <item.icon />}
					<span>{item.title}</span>
					{item.badge && (
						<Badge className="rounded-full px-1 py-0 text-xs">
							{item.badge}
						</Badge>
					)}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

function SidebarNavCollapsible({
	item,
	href,
	collapsed = false,
}: {
	item: NavCollapsible;
	href: string;
	collapsed?: boolean;
}) {
	const { setOpenMobile } = useSidebar();

	const isActive = isActiveRoute(href, item);

	if (collapsed) {
		return (
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
							isActive={isActive}
							tooltip={item.title}
						>
							{item.icon && <item.icon />}
							<span>{item.title}</span>
							{item.badge && (
								<Badge className="rounded-full px-1 py-0 text-xs">
									{item.badge}
								</Badge>
							)}
							<ChevronRight className="ms-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="start" side="right" sideOffset={4}>
						<DropdownMenuLabel>{item.title}</DropdownMenuLabel>
						<DropdownMenuSeparator />

						{item.items?.map((sub) => (
							<DropdownMenuItem asChild key={sub.title}>
								<Link to={sub.url}>
									{sub.icon && <sub.icon />}
									<span>{sub.title}</span>
									{sub.badge && (
										<span className="ms-auto text-xs">{sub.badge}</span>
									)}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		);
	}

	return (
		<Collapsible asChild defaultOpen={isActive}>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton
						className="bg-transparent! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent! data-[active=true]:text-sidebar-accent-foreground!"
						isActive={isActive}
						size="lg"
						tooltip={item.title}
					>
						{item.icon && <item.icon />}
						<span>{item.title}</span>
						{item.badge && (
							<Badge className="rounded-full px-1 py-0 text-xs">
								{item.badge}
							</Badge>
						)}
						<ChevronRight className="ms-auto transition-transform group-data-[state=open]:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenuSub>
						{item.items?.map((sub) => (
							<SidebarMenuSubItem key={sub.title}>
								<SidebarMenuSubButton
									asChild
									className="bg-transparent! hover:bg-sidebar-accent!"
									isActive={isActive}
									onClick={() => setOpenMobile(false)}
									size="md"
								>
									<Link to={sub.url}>
										{sub.icon && <sub.icon />}
										<span>{sub.title}</span>
										{sub.badge && (
											<Badge className="rounded-full px-1 py-0 text-xs">
												{sub.badge}
											</Badge>
										)}
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}

function isActiveRoute(href: string, item: NavItem): boolean {
	const cleanHref = href.split("?")[0] ?? "";

	// LINK ITEM
	if ("url" in item) {
		const itemUrl = item.url;

		// Exact match
		if (cleanHref === itemUrl) return true;

		// Root guard
		if (itemUrl === "/") return cleanHref === "/";

		// Sub-routes: /settings/*
		return cleanHref.startsWith(`${itemUrl}/`);
	}

	// COLLAPSIBLE ITEM
	if ("items" in item && item.items) {
		return item.items.some((child) =>
			isActiveRoute(cleanHref, child as NavItem)
		);
	}

	return false;
}

export {
	SidebarNavBadge,
	SidebarNavSection,
	SidebarNavItem,
	SidebarNavCollapsible,
	isActiveRoute,
};
