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

// Super Admin Platform Role
export const admin = accessControl.newRole({
	...defaultStatements,
	...adminAc.statements,
	apiKey: ["update", "delete"],
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

// Regular worker — does their job, sees their team, no admin tasks
export const member = accessControl.newRole({
	...defaultStatements,
	...memberAc.statements,
});

export const Roles = {
	admin,
	owner,
	member,
} as const;

export type AuthRole = keyof typeof Roles;

export const ORGANIZATION_MEMBER_ROLES = ["owner", "member"];

export const ADMIN_ROLES = ["admin"];
