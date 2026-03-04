import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";

export const permissions = {
	...defaultStatements,
	user: [
		"create",
		"list",
		"set-role",
		"ban",
		"impersonate",
		"delete",
		"set-password",
	],
	session: ["list", "revoke", "delete"],
	apiKey: ["create", "read", "update", "delete"],
} as const;

export const accessControl = createAccessControl(permissions);

// ─────────────────────────────────────────────
// PLATFORM-LEVEL ROLES (above org scope)
// ─────────────────────────────────────────────

// Full platform access — internal/system use only
export const superAdmin = accessControl.newRole({
	user: [
		"create",
		"list",
		"set-role",
		"ban",
		"impersonate",
		"delete",
		"set-password",
	],
	session: ["list", "revoke", "delete"],
});

// ─────────────────────────────────────────────
// ORGANIZATION-LEVEL ROLES (scoped to their org)
// ─────────────────────────────────────────────

// Owns the org — full control over everything inside it,
// including who has what role
export const owner = accessControl.newRole({
	...defaultStatements,
	...ownerAc.statements,
});

// Manages the org day-to-day — can add/remove members and teams,
// but can't delete the org or redefine roles
export const admin = accessControl.newRole({
	...defaultStatements,
	...adminAc.statements,
	apiKey: ["read"],
});

// Regular worker — does their job, sees their team, no admin tasks
export const member = accessControl.newRole({
	...defaultStatements,
	...memberAc.statements,
	apiKey: [],
});

export const guest = accessControl.newRole({
	user: [],
	session: [],
	organization: [],
	invitation: [],
	team: [],
	ac: [],
});

export const Roles = {
	superAdmin,

	owner,
	admin,
	member,
	guest,
} as const;

/**
 * All possible role strings derived from the AllRoles object
 */
export type AuthRole = keyof typeof Roles;

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
export type OrganizationRole = Extract<AuthRole, "owner" | "admin" | "member">;

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

export const PLATFORM_ROLES: PlatformRole[] = ["superAdmin"];

export const ORGANIZATION_ADMIN_ROLES: (PlatformRole | "owner" | "admin")[] = [
	...PLATFORM_ROLES,
	"owner",
	"admin",
];

export const ORGANIZATION_MEMBER_ROLES: (
	| PlatformRole
	| "owner"
	| "admin"
	| "member"
)[] = [...PLATFORM_ROLES, "owner", "admin", "member"];

export const AUTH_ROLES: readonly AuthRole[] = [
	"superAdmin",
	"owner",
	"admin",
	"member",
] as const;

/**
 * All resource strings: "organization" | "team" | "user" | "role" | ...
 */
export type Resource = keyof typeof permissions;
