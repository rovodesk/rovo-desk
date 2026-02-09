import type { AuthRole } from "@zero-heads-lab/auth/access-control";
import type { LucideIcon } from "lucide-react";

export type NavRoute = string & {};

export type IconComponent = LucideIcon & unknown;

/**
 * Optional: allow apps to narrow routes
 * via declaration merging if they want
 *
 * declare module "./nav-types" {
 *   interface RouteMap {
 *     "/dashboard": true;
 *     "/settings": true;
 *   }
 * }
 */

// biome-ignore lint/suspicious/noEmptyInterface: Framework specific
export interface RouteMap {}

/**
 * If RouteMap is augmented, routes are narrowed.
 * Otherwise, it's just string.
 */
export type TypedRoute = keyof RouteMap extends never
	? NavRoute
	: keyof RouteMap;

export type NavItemVisibility = {
	roles: AuthRole[];
	// plan?: string
};

export type BaseNavItem = {
	title: string;
	badge?: number;
	icon?: IconComponent;
	visibility?: NavItemVisibility;
};

/* =========================
   Navigation items
   ========================= */

export type NavLink = BaseNavItem & {
	url: TypedRoute;
	items?: never;
};

export type NavCollapsible = BaseNavItem & {
	url?: never;
	items?: (BaseNavItem & { url: TypedRoute })[];
};

export type NavItem = NavLink | NavCollapsible;

/* =========================
   Groups & config
   ========================= */

export type NavGroup = {
	title?: string;
	items: NavItem[];
};

export type SidebarConfig = {
	navGroups: NavGroup[];
	quickLinks?: {
		primary?: Omit<NavLink, "items">[];
		secondary?: Omit<NavLink, "items" | "badge">[];
	};
	footer: NavItem[];
};
