import type { AuthRole } from "@zero-heads-lab/auth/access-control";
import type {
	NavItem,
	NavItemVisibility,
	NavLink,
	SidebarConfig,
} from "@/types/sidebar";

export function isNavItemVisible(
	visibility: NavItemVisibility | undefined,
	authRole: AuthRole
): boolean {
	//Defaults to visible unless restricted.
	if (!visibility) return true;

	const { roles } = visibility;

	// Match the authRole with the visibility roles
	if (roles && !roles.includes(authRole)) return false;

	return true;
}

function filterNavItem(item: NavItem, role: AuthRole): NavItem | null {
	// ⛔ Parent not allowed → drop immediately
	if (!isNavItemVisible(item.visibility, role)) {
		return null;
	}

	// COLLAPSIBLE
	if ("items" in item && item.items) {
		const filteredChildren: NavLink[] = item.items
			.map((child) => {
				const effectiveVisibility = child.visibility ?? item.visibility;

				return isNavItemVisible(effectiveVisibility, role) ? child : null;
			})
			.filter(Boolean) as NavLink[];

		if (!filteredChildren.length) return null;

		return {
			...item,
			items: filteredChildren,
		};
	}

	return item;
}

function filterNavLinks<T extends NavLink>(
	items: T[] | undefined,
	role: AuthRole
): T[] | undefined {
	if (!items) return undefined;

	return items.filter((item) => isNavItemVisible(item.visibility, role));
}

export function filterSidebarConfig(
	config: SidebarConfig,
	role: AuthRole | null
): SidebarConfig {
	if (!role) return config;

	return {
		...config,

		navGroups: config.navGroups
			.map((group) => {
				const items = group.items
					.map((item) => filterNavItem(item, role))
					.filter(Boolean) as NavItem[];

				if (!items.length) return null;

				return { ...group, items };
			})
			.filter(Boolean) as NonNullable<SidebarConfig["navGroups"]>,

		quickLinks: config.quickLinks
			? {
					primary: filterNavLinks(config.quickLinks.primary, role),
					secondary: filterNavLinks(config.quickLinks.secondary, role),
				}
			: undefined,
	};
}
