import type { ApiKey } from "@better-auth/api-key";
import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";
import { Globe2Icon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { AppAccessRoles, type AuthRole } from "./access-control";
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

export const determineAuthRoles = (role?: string): AuthRole[] => {
	if (!role) return [];

	const parsed = role
		.split(/[\s,]+/)
		.map((r) => r.trim().toLowerCase())
		.filter(Boolean)
		.map((r) => {
			switch (r) {
				case "owner":
					return "owner";
				case "admin":
					return "admin";
				case "member":
					return "member";
				case "user":
					return "user";
				case "demouser":
					return "demoUser";
				case "betauser":
					return "betaUser";
				case "anonymous":
					return "anonymous";
				default:
					return "anonymous";
			}
		})
		.filter((r): r is AuthRole => r !== null);

	return Array.from(new Set(parsed)); // ✅ dedupe
};

export const hasAppAccess = (role: AuthRole): boolean => {
	return AppAccessRoles.includes(role);
};

export const isValidApiKey = (key: Partial<ApiKey>): boolean => {
	if (!key.id) return false;

	// ✅ Enabled
	if (!key.enabled) return false;

	// ✅ Expiry
	if (key.expiresAt && key.expiresAt < new Date()) return false;

	// ✅ Remaining
	if (key.remaining && key.remaining !== null && key.remaining <= 0)
		return false;

	return true;
};

// TEST:  Needs Testing
export function extractNameFromEmail(email: string): string {
	if (!email || typeof email !== "string") return "";

	// Normalize
	email = email.trim().toLowerCase();
	if (!email) return "";

	// Use the LAST @ as separator
	const atIndex = email.lastIndexOf("@");

	// No @ found → treat full string as local part
	let local = atIndex === -1 ? email : email.slice(0, atIndex);

	if (!local) return "";

	// Replace all stray @ with spaces
	local = local.replaceAll("@", " ");

	// Remove aliasing (e.g. john+work -> john)
	local = local.replace(/\+.*$/, "");

	// Replace separators with spaces
	local = local.replace(/[-_.]+/g, " ");

	// Collapse whitespace
	local = local.replace(/\s+/g, " ").trim();

	if (!local) return "";

	// Capitalize each word
	const name = local
		.split(" ")
		.map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
		.join(" ");

	return name;
}
