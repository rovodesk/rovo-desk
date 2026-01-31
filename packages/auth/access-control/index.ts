import { createAccessControl } from "better-auth/plugins/access";

/**
 * Define all permissions once (single source of truth)
 */
const permissions = {
	folders: ["create", "read", "list", "share", "update", "delete"],
	files: ["create", "read", "list", "share", "update", "delete"],
	organization: ["create", "read", "list", "update", "delete"],
	team: ["create", "read", "list", "update", "delete"],
} as const;

/**
 * Initialize access control
 */
const accessControl = createAccessControl(permissions);

/**
 * Roles
 */

// Full system access (project owner)
const owner = accessControl.newRole({
	folders: ["create", "read", "list", "share", "update", "delete"],
	files: ["create", "read", "list", "share", "update", "delete"],
	organization: ["create", "read", "list", "update", "delete"],
	team: ["create", "read", "list", "update", "delete"],
});

// Administrative access (no ownership semantics)
const admin = accessControl.newRole({
	folders: ["create", "read", "list", "share", "update", "delete"],
	files: ["create", "read", "list", "share", "update", "delete"],
	organization: ["read", "list", "update"],
	team: ["create", "read", "list", "update", "delete"],
});

// Standard collaborator
const member = accessControl.newRole({
	folders: ["read", "list", "share"],
	files: ["read", "list", "share"],
	organization: ["read", "list"],
	team: ["read", "list"],
});

export { accessControl, owner, admin, member };
