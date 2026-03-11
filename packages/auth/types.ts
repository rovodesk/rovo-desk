import type { permissions } from "./access-control";
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

export type Team = {
	id: string;
	name: string;
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
 * A raw map of permissions returned by the auth client.
 */
export type ClientPermissionMap = Parameters<
	typeof authClient.organization.checkRolePermission
>[0]["permissions"];
