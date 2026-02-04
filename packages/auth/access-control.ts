import { createAccessControl } from "better-auth/plugins/access";

export const permissions = {
	organization: ["create", "read", "list", "update", "delete"],
	team: ["create", "read", "list", "update", "delete"],
	user: ["create", "read", "list", "update", "delete"],
	role: ["create", "read", "list", "update", "delete"],
	permission: ["create", "read", "list", "update", "delete"],

	conversations: ["create", "read", "list", "update", "delete"],
	tasks: ["create", "read", "list", "update", "delete"],
	funnels: ["create", "read", "list", "update", "delete"],
	folders: ["create", "read", "list", "update", "delete"],
	files: ["create", "read", "list", "update", "delete"],
} as const;

const accessControl = createAccessControl(permissions);

// ─────────────────────────────────────────────
// PLATFORM-LEVEL ROLES (above org scope)
// ─────────────────────────────────────────────

// Full platform access — internal/system use only
const superAdmin = accessControl.newRole({
	organization: ["create", "read", "list", "update", "delete"],
	team: ["create", "read", "list", "update", "delete"],
	user: ["create", "read", "list", "update", "delete"],
	role: ["create", "read", "list", "update", "delete"],
	permission: ["create", "read", "list", "update", "delete"],

	conversations: ["create", "read", "list", "update", "delete"],
	tasks: ["create", "read", "list", "update", "delete"],
	funnels: ["create", "read", "list", "update", "delete"],
	folders: ["create", "read", "list", "update", "delete"],
	files: ["create", "read", "list", "update", "delete"],
});

// Can view/moderate content across orgs, manage users, but can't
// restructure orgs or touch role/permission definitions
const moderator = accessControl.newRole({
	organization: ["read", "list"],
	team: ["read", "list"],
	user: ["read", "list", "update", "delete"],
	role: ["read", "list"],
	permission: ["read", "list"],

	conversations: ["create", "read", "list", "update", "delete"],
	tasks: ["create", "read", "list", "update", "delete"],
	funnels: ["create", "read", "list", "update", "delete"],
	folders: ["create", "read", "list", "update", "delete"],
	files: ["create", "read", "list", "update", "delete"],
});

// Read-only across the platform — answers questions, doesn't change things
const support = accessControl.newRole({
	organization: ["read", "list"],
	team: ["read", "list"],
	user: ["read", "list"],
	role: ["read", "list"],
	permission: ["read", "list"],

	conversations: ["read", "list"],
	tasks: ["read", "list"],
	funnels: ["read", "list"],
	folders: ["read", "list"],
	files: ["read", "list"],
});

// ─────────────────────────────────────────────
// ORGANIZATION-LEVEL ROLES (scoped to their org)
// ─────────────────────────────────────────────

// Owns the org — full control over everything inside it,
// including who has what role
const organizationOwner = accessControl.newRole({
	organization: ["read", "update", "delete"],
	team: ["create", "read", "list", "update", "delete"],
	user: ["create", "read", "list", "update", "delete"],
	role: ["create", "read", "list", "update", "delete"],
	permission: ["read", "list"],

	conversations: ["read", "list"],
	tasks: ["create", "read", "list", "update", "delete"],
	funnels: ["create", "read", "list", "update", "delete"],
	folders: ["create", "read", "list", "update", "delete"],
	files: ["create", "read", "list", "update", "delete"],
});

// Manages the org day-to-day — can add/remove members and teams,
// but can't delete the org or redefine roles
const organizationAdmin = accessControl.newRole({
	organization: ["read"],
	team: ["create", "read", "list", "update", "delete"],
	user: ["create", "read", "list", "update", "delete"],
	role: ["read", "list"],
	permission: ["read", "list"],

	conversations: ["read", "list"],
	tasks: ["create", "read", "list", "update", "delete"],
	funnels: ["create", "read", "list", "update", "delete"],
	folders: ["create", "read", "list", "update", "delete"],
	files: ["create", "read", "list", "update", "delete"],
});

// Regular worker — does their job, sees their team, no admin tasks
const organizationMember = accessControl.newRole({
	organization: ["read"],
	team: ["read", "list"],
	user: ["read", "list"],
	role: [],
	permission: [],

	conversations: ["read", "list"],
	tasks: ["read", "list", "update"],
	funnels: ["read", "list", "update"],
	folders: ["read", "list", "update"],
	files: ["read", "list", "update"],
});

// ─────────────────────────────────────────────
// RESTRICTED / LIFECYCLE ROLES
// ─────────────────────────────────────────────

// Logged out / no account — can only browse public-facing things
const anonymous = accessControl.newRole({
	organization: [],
	team: [],
	user: [],
	role: [],
	permission: [],
	funnels: ["read", "list"], // e.g. public landing pages
	folders: [],
	files: [],
});

// Signed up but email not confirmed — locked out until verified
const unverified = accessControl.newRole({
	organization: [],
	team: [],
	user: ["read"], // can see their own profile
	role: [],
	permission: [],
	funnels: [],
	folders: [],
	files: [],
});

const verified = accessControl.newRole({
	organization: [],
	team: [],
	user: ["read"], // can see their own profile
	role: [],
	permission: [],
	funnels: [],
	folders: [],
	files: [],
});

// Account flagged as deleted — no access at all
const deleted = accessControl.newRole({
	organization: [],
	team: [],
	user: [],
	role: [],
	permission: [],
	funnels: [],
	folders: [],
	files: [],
});

const AllRoles = {
	superAdmin,
	moderator,
	support,

	organizationOwner,
	organizationAdmin,
	organizationMember,

	verified,
	unverified,
	anonymous,

	deleted,
} as const;

export { accessControl, AllRoles };

/**
 * All possible role strings derived from the AllRoles object
 */
export type AuthRole = keyof typeof AllRoles;

/**
 * Platform-level roles (above org scope)
 */
export type PlatformRole = Extract<
	AuthRole,
	"superAdmin" | "moderator" | "support"
>;

/**
 * Organization-scoped roles
 */
export type OrganizationRole = Extract<
	AuthRole,
	"organizationOwner" | "organizationAdmin" | "organizationMember"
>;

/**
 * Lifecycle / restricted state roles
 */
export type LifecycleRole = Extract<
	AuthRole,
	"anonymous" | "unverified" | "deleted"
>;

/**
 * Resources that are about platform/org management
 */
export type CoreResource = Extract<
	Resource,
	"organization" | "team" | "user" | "role" | "permission"
>;

/**
 * Resources that are the actual product features
 */
export type FeatureResource = Extract<
	Resource,
	"funnels" | "folders" | "files"
>;

export const PLATFORM_ROLES: PlatformRole[] = [
	"superAdmin",
	"moderator",
	"support",
];
export const ORGANIZATION_ADMIN_ROLES: (
	| PlatformRole
	| "organizationOwner"
	| "organizationAdmin"
)[] = [...PLATFORM_ROLES, "organizationOwner", "organizationAdmin"];

export const ORGANIZATION_MEMBER_ROLES: (
	| PlatformRole
	| "organizationOwner"
	| "organizationAdmin"
	| "organizationMember"
)[] = [
	...PLATFORM_ROLES,
	"organizationOwner",
	"organizationAdmin",
	"organizationMember",
];

export const AUTH_ROLES: readonly AuthRole[] = [
	"superAdmin",
	"moderator",
	"support",
	"organizationOwner",
	"organizationAdmin",
	"organizationMember",
	"verified",
	"unverified",
	"anonymous",
	"deleted",
] as const;

export const LIFECYCLE_ROLES: LifecycleRole[] = [
	"anonymous",
	"unverified",
	"deleted",
];

/**
 * All resource strings: "organization" | "team" | "user" | "role" | ...
 */
export type Resource = keyof typeof permissions;
