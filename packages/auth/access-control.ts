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
<<<<<<< HEAD
	...adminAc.statements,
	user: ["list", "create"],
	apiKey: ["update", "delete"],
=======
	...defaultStatements,
	...adminAc.statements,
	apiKey: ["update", "delete"]
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
});

// ─────────────────────────────────────────────
// ORGANIZATION-LEVEL ROLES (scoped to their org)
// ─────────────────────────────────────────────

// Owns the org — full control over everything inside it,
// including who has what role
export const owner = accessControl.newRole({
	...ownerAc.statements,
<<<<<<< HEAD
	apiKey: ["create", "read", "update", "delete"],
=======
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
});

// Regular worker — does their job, sees their team, no admin tasks
export const member = accessControl.newRole({
	...memberAc.statements,
<<<<<<< HEAD
	apiKey: [],
});

export const demoUser = accessControl.newRole({
	apiKey: [],
});
export const betaUser = accessControl.newRole({
	apiKey: [],
});
export const user = accessControl.newRole({
	apiKey: [],
=======
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
});

export const Roles = {
	admin,
	owner,
	member,
<<<<<<< HEAD
	demoUser,
	betaUser,
	user,
} as const;

export const ORGANIZATION_MEMBER_ROLES = ["owner", "member"];

export const ADMIN_ROLES = ["admin"];

//FIXME: Update default role to user when not in BETA
export const DEFAULT_ROLE = "betaUser";

export const AuthRoles = [
	"admin",
	"owner",
	"member",
	"demoUser",
	"betaUser",
	"user",
] as const;
export type AuthRole = (typeof AuthRoles)[number];
=======
} as const;

export type AuthRole = keyof typeof Roles;

export const ORGANIZATION_MEMBER_ROLES = ["owner", "member"];

export const ADMIN_ROLES = ["admin"];
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
