import type {
	NavItem,
	NavItemVisibility,
	NavLink,
	SidebarConfig,
} from "@/types/sidebar";

type PermissionMap = Record<string, boolean>;

export function isNavItemVisible(
	visibility: NavItemVisibility | undefined,
	permissions: PermissionMap
): boolean {
	//Defaults to visible unless restricted.
	if (!visibility) return true;

	const { resource, actions } = visibility;

	// Permission gate (ONLY if permissions exist)
	if (resource && actions?.length) {
		return actions.some((action) => {
			const key = `${resource}:${action}`;
			return permissions[key] === true;
		});
	}

	return true;
}

function filterNavItem(
	item: NavItem,
	permissions: PermissionMap
): NavItem | null {
	// ⛔ Parent not allowed → drop immediately
	if (!isNavItemVisible(item.visibility, permissions)) {
		return null;
	}

	// COLLAPSIBLE
	if ("items" in item && item.items) {
		const filteredChildren: NavLink[] = item.items
			.map((child) => {
				const effectiveVisibility = child.visibility ?? item.visibility;

				return isNavItemVisible(effectiveVisibility, permissions)
					? child
					: null;
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
	permissions: PermissionMap
): T[] | undefined {
	if (!items) return undefined;

	return items.filter((item) => isNavItemVisible(item.visibility, permissions));
}

export function filterSidebarConfig(
	config: SidebarConfig,
	permissions: PermissionMap
): SidebarConfig {
	return {
		...config,

		navGroups: config.navGroups
			.map((group) => {
				const items = group.items
					.map((item) => filterNavItem(item, permissions))
					.filter(Boolean) as NavItem[];

				if (!items.length) return null;

				return { ...group, items };
			})
			.filter(Boolean) as NonNullable<SidebarConfig["navGroups"]>,

		quickLinks: config.quickLinks
			? {
					primary: filterNavLinks(config.quickLinks.primary, permissions),
					secondary: filterNavLinks(config.quickLinks.secondary, permissions),
				}
			: undefined,
	};
}
