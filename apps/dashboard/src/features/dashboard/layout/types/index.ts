import type { LinkProps } from "@tanstack/react-router";

//type Permission =
// 	| "domain:read"
// 	| "domain:write"
// 	| "domain:ai:manage"
// 	| "domain:errors:view"
// 	| "campaigns:manage"
// 	| "users:manage"
// 	| "billing:manage";

//type FeatureFlag =
// 	| "ai_agents"
// 	| "domain_errors"
// 	| "campaigns"
// 	| "knowledge_base";

//interface VisibilityRule {
// 	allOf?: Permission[];
// 	anyOf?: Permission[];
// 	features?: FeatureFlag[];
// }

type BaseNavItem = {
	title: string;
	badge?: string;
	icon?: React.ElementType;
};

type NavRoute = LinkProps["to"] | (string & {});

type NavLink = BaseNavItem & {
	url: NavRoute;
	items?: never;
	// visibility?: VisibilityRule;
};
type NavCollapsible = BaseNavItem & {
	url?: never;
	items?: (BaseNavItem & { url: NavRoute })[];
	// visibility?: VisibilityRule;
};
type NavItem = NavLink | NavCollapsible;

type NavGroup = {
	title?: string;
	items: NavItem[];
};

type SidebarConfig = {
	navGroups: NavGroup[];
	footer: NavItem[];
};

export type {
	BaseNavItem,
	NavLink,
	NavCollapsible,
	NavItem,
	NavGroup,
	NavRoute,
	SidebarConfig,
};
