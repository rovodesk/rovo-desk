import type { permissions, Resource } from "./access-control";
import type { authClient } from "./client";
import type { createAuth } from "./server/better-auth";

export type AuthInstance = Awaited<ReturnType<typeof createAuth>>;
export type AuthClient = typeof authClient;

export type Session = AuthInstance["$Infer"]["Session"];
export type AuthSession = Session["session"];
export type AuthUser = Session["user"];

export type DeviceSession = {
	session: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		userId: string;
		expiresAt: Date;
		token: string;
		ipAddress?: string | null;
		userAgent?: string | null;
		lastActiveAt?: Date | null;
		revokedAt?: Date | null;
	};

	user: {
		id: string;
		email: string;
		emailVerified: boolean;
		name: string;
		image?: string | null;
	};
};

export type Organization = {
	id: string;
	name: string;
	slug: string;
	__optimistic?: boolean;
};

export type NavigateFn = (href: string) => void;

export type ReplaceFn = (href: string) => void;

export type MutationOptions = {
	onSuccess?: (...args: Record<string, unknown>[]) => void;
	onError?: (error: Error) => void;
};

export type OAuthProvider = "google" | "github";

// "superAdmin" | "moderator" | "support" | "owner" | ...

/**
 * All action strings: "create" | "read" | "list" | "update" | "delete"
 */
export type PermissionAction =
	(typeof permissions)[keyof typeof permissions][number];

/**
 * The actions available on a specific resource.
 * Usage: ActionsOf<"organization"> → "create" | "read" | "list" | "update" | "delete"
 *        ActionsOf<"role">         → "create" | "read" | "list" | "update" | "delete"
 * Stays accurate if you ever narrow a resource's actions down.
 */
export type ActionsOf<R extends Resource> = (typeof permissions)[R][number];

/**
 * The full permissions map as a type.
 * { organization: readonly ["create", "read", ...], team: readonly [...], ... }
 */
export type PermissionsMap = typeof permissions;

/**
 * A single permission as a [resource, action] tuple.
 * Useful for passing permissions around as data.
 * Example: ["funnels", "create"] is valid, ["funnels", "foo"] is not.
 */
export type PermissionTuple = {
	[R in Resource]: [R, ActionsOf<R>];
}[Resource];

/**
 * A partial permission grant — mirrors what you pass into newRole().
 * Every resource is optional, and each maps to a subset of its valid actions.
 * Example: { funnels: ["read", "list"], folders: ["read"] }
 */
export type PermissionGrant = {
	[R in Resource]?: ActionsOf<R>[];
};

/**
 * A map of permissions to check, indexed by resource.
 */
export type PermissionCheckMap = Partial<Record<Resource, PermissionAction[]>>;

/**
 * A map of permission check results, indexed by "resource:action".
 */
export type AuthorizationResultMap = Record<string, boolean>;

/**
 * A raw map of permissions returned by the auth client.
 */
export type ClientPermissionMap = Parameters<
	typeof authClient.organization.checkRolePermission
>[0]["permissions"];
