import { Globe2Icon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { z } from "zod";
import type {
	AuthRole,
	OrganizationRole,
	PlatformRole,
} from "./access-control";
import {
	AUTH_ROLES,
	LIFECYCLE_ROLES,
	ORGANIZATION_MEMBER_ROLES,
	PLATFORM_ROLES,
} from "./access-control";
import type { Session } from "./types";

/**
 * Validated session result - discriminated union
 */
export type SessionValidation =
	| {
			valid: false;
			reason: "no_session" | "expired" | "unverified" | "anonymous" | "deleted";
	  }
	| { valid: true; session: NonNullable<Session> };

/**
 * Validate session state
 */
export function validateSession(session: Session | null): SessionValidation {
	if (!session) {
		return { valid: false, reason: "no_session" };
	}

	const isExpired = session.session.expiresAt < new Date();
	if (isExpired) {
		return { valid: false, reason: "expired" };
	}

	const isUnverified = !session.user.emailVerified;
	if (isUnverified) {
		return { valid: false, reason: "unverified" };
	}

	const isAnonymous = session.user.isAnonymous;
	if (isAnonymous) {
		return { valid: false, reason: "anonymous" };
	}

	const isDeleted = !!session.user.deletedAt;
	if (isDeleted) {
		return { valid: false, reason: "deleted" };
	}

	return { valid: true, session };
}

/**
 * Platform-level access (superAdmin, moderator, support)
 */
export function hasPlatformAccessRole(role: unknown): role is PlatformRole {
	try {
		const parsed = z.enum(PLATFORM_ROLES).parse(role);
		return PLATFORM_ROLES.includes(parsed);
	} catch {
		return false;
	}
}

/**
 * Organization-level access (owner/admin/member + platform roles)
 */
export function hasOrganizationAccessRole(
	role: unknown
): role is OrganizationRole | PlatformRole {
	try {
		const parsed = z.enum(ORGANIZATION_MEMBER_ROLES).parse(role);
		return ORGANIZATION_MEMBER_ROLES.includes(parsed);
	} catch {
		return false;
	}
}

/**
 * User has org access AND an active organization
 */
export function hasOrganizationAccess(session: Session | null): boolean {
	if (!session) return false;
	if (!session.session.activeOrganizationId) return false;

	return hasOrganizationAccessRole(session.user.role);
}

/**
 * User has any access at all (platform OR org)
 */
export function hasAccess(session: Session | null): boolean {
	if (!session) return false;

	return (
		hasPlatformAccessRole(session.user.role) || hasOrganizationAccess(session)
	);
}

/**
 * Lifecycle roles (anonymous, unverified, deleted)
 */
export function isLifecycleRole(role: unknown): boolean {
	// biome-ignore lint/suspicious/noExplicitAny: Anything can be a lifecycle role
	return LIFECYCLE_ROLES.includes(role as any);
}

/**
 * Determine the access role for a user
 *
 * @param role
 * @returns {AuthRole}
 */
export function determineAccessRole(role: unknown): AuthRole {
	if (hasPlatformAccessRole(role)) {
		return role;
	}

	if (hasOrganizationAccessRole(role)) {
		return role;
	}

	if (isLifecycleRole(role)) {
		return role as AuthRole;
	}

	return "anonymous";
}

export function isAuthRole(value: unknown): value is AuthRole {
	return AUTH_ROLES.includes(value as AuthRole);
}

export function getDeviceInfo(userAgent?: string | null) {
	if (!userAgent) {
		return { label: "Unknown device", Icon: MonitorIcon };
	}

	const ua = userAgent.toLowerCase();

	const isMobile =
		ua.includes("iphone") || ua.includes("android") || ua.includes("mobile");

	const isWeb =
		ua.includes("chrome") ||
		ua.includes("firefox") ||
		ua.includes("safari") ||
		ua.includes("edge") ||
		ua.includes("mozilla");

	const isDesktop =
		ua.includes("windows") || ua.includes("mac") || ua.includes("linux");

	if (isMobile) {
		return { label: "Mobile device", Icon: SmartphoneIcon };
	}

	if (isWeb) {
		return { label: "Browser", Icon: Globe2Icon };
	}

	if (isDesktop) {
		return { label: "Desktop device", Icon: MonitorIcon };
	}

	return { label: "Unknown device", Icon: MonitorIcon };
}
