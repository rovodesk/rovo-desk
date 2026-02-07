import type { AuthRole } from "@zero-heads-lab/auth/access-control";
import type {
	NavItem,
	NavItemVisibility,
	NavLink,
	SidebarConfig,
} from "@/types/sidebar";

type PermissionMap = Record<string, boolean>;

export function isNavItemVisible(
	visibility: NavItemVisibility | undefined,
	role: AuthRole,
	permissions: PermissionMap
): boolean {
	if (!visibility) return false;

	const { roles, resource, actions } = visibility;

	if (roles && !roles.includes(role)) {
		return false;
	}

	if (resource && actions?.length) {
		return actions.some(
			(action) => permissions[`${resource}:${action}`] === true
		);
	}

	return true;
}

function filterNavItem(
	item: NavItem,
	role: AuthRole,
	permissions: PermissionMap
): NavItem | null {
	// ⛔ Parent not allowed → drop immediately
	if (!isNavItemVisible(item.visibility, role, permissions)) {
		return null;
	}

	// COLLAPSIBLE
	if ("items" in item && item.items) {
		const filteredChildren: NavLink[] = item.items
			.map((child) => {
				const effectiveVisibility = child.visibility ?? item.visibility;

				return isNavItemVisible(effectiveVisibility, role, permissions)
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
	role: AuthRole,
	permissions: PermissionMap
): T[] | undefined {
	if (!items) return undefined;

	return items.filter((item) =>
		isNavItemVisible(item.visibility, role, permissions)
	);
}

export function filterSidebarConfig(
	config: SidebarConfig,
	role: AuthRole,
	permissions: PermissionMap
): SidebarConfig {
	return {
		...config,

		navGroups: config.navGroups
			.map((group) => {
				const items = group.items
					.map((item) => filterNavItem(item, role, permissions))
					.filter(Boolean) as NavItem[];

				if (!items.length) return null;

				return { ...group, items };
			})
			.filter(Boolean) as NonNullable<SidebarConfig["navGroups"]>,

		quickLinks: config.quickLinks
			? {
					primary: filterNavLinks(config.quickLinks.primary, role, permissions),
					secondary: filterNavLinks(
						config.quickLinks.secondary,
						role,
						permissions
					),
				}
			: undefined,
	};
}
