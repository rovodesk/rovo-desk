import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";
import { Globe2Icon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import type { AuthRole } from "./access-control";
import { AUTH_CONFIG } from "./config";
import type { AuthClient, Session } from "./types";

/**
 * Validated session result - discriminated union
 */
export type SessionValidation =
	| {
			valid: false;
			reason: "no_session" | "expired" | "unverified" | "deleted";
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

	const isDeleted = !!session.user.deletedAt;
	if (isDeleted) {
		return { valid: false, reason: "deleted" };
	}

	return { valid: true, session };
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

export function generateSlug(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}

// slug.api.ts
export const checkDomainSlug = async (
	authClient: AuthClient,
	slug: string
): Promise<boolean> => {
	const { data, error } = await authClient.organization.checkSlug({ slug });

	if (error) throw error;

	return data.status;
};

const JWKS = createRemoteJWKSet(new URL(AUTH_CONFIG.JWKS_URL));

export async function validateAuthToken(token: string): Promise<JWTPayload> {
	try {
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: AUTH_CONFIG.JWT_ISSUER,
			audience: AUTH_CONFIG.JWT_AUDIENCE,
			algorithms: [AUTH_CONFIG.JWT_ALGORITHM], // restrict allowed alg
		});

		return payload;
	} catch (error) {
		console.error("Token validation failed:", error);
		throw new Error("Unauthorized");
	}
}

export const determineAuthRole = (role?: string): AuthRole | null => {
	if (!role) return null;

	switch (role.trim().toLowerCase()) {
		case "owner":
			return "owner";
		case "admin":
			return "admin";
		case "member":
			return "member";
		default:
			return null;
	}
};
