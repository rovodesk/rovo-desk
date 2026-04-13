// /** biome-ignore-all lint/suspicious/noExplicitAny: Add types later */

// import { signJWTToken, verifyJWTToken } from "@zero-heads-lab/crypto";
// import { extractOrigins } from "@zero-heads-lab/shared/utils";
// import type { Context } from "hono";
// import { getCookie, setCookie } from "hono/cookie";
// import type { z } from "zod";
// import type { Identity } from "../types";

// export const getAllowedOrigins = (c: Context) => {
// 	return extractOrigins(c.env.ALLOWED_ORIGINS || "");
// };

// export async function validateJson<T extends z.ZodTypeAny>(
// 	c: Context,
// 	schema: T
// ) {
// 	const body = await c.req.json().catch(() => null);

// 	if (!body) {
// 		return {
// 			ok: false as const,
// 			response: c.json({ error: "Invalid JSON body" }, 400),
// 		};
// 	}

// 	const parsed = schema.safeParse(body);

// 	if (!parsed.success) {
// 		return {
// 			ok: false as const,
// 			response: c.json(
// 				{
// 					error: "Validation failed",
// 					issues: parsed.error.flatten(),
// 				},
// 				400
// 			),
// 		};
// 	}

// 	return {
// 		ok: true as const,
// 		data: parsed.data,
// 	};
// }

// function getVisitorIdentity(c: Context): Identity {
// 	let sessionId = getCookie(c, "widget_session");

// 	if (!sessionId) {
// 		sessionId = `visitor_${crypto.randomUUID()}`;
// 		setCookie(c, "widget_session", sessionId, {
// 			httpOnly: false, // must be readable by frontend
// 			sameSite: "Lax",
// 			secure: true,
// 			path: "/",
// 			maxAge: 60 * 60 * 24 * 7,
// 		});
// 	}

// 	return {
// 		"x-user-id": sessionId,
// 		"x-org-id": "visitor",
// 		"x-role": "visitor",
// 	};
// }

// export async function resolveIdentity(c: Context): Promise<Identity> {
// 	const token = extractToken(c);

// 	if (!token) {
// 		return getVisitorIdentity(c);
// 	}

// 	try {
// 		// ⚠️ You MUST resolve orgId first (see below)
// 		const orgId = c.req.header("x-org-id") || c.req.query("organizationId");

// 		if (!orgId) return getVisitorIdentity(c);

// 		const payload = await verifyJWTToken(token, c.env.JWT_SECRET);

// 		return {
// 			"x-user-id": payload.sub as string,
// 			"x-org-id": payload.orgId as string,
// 			"x-role": "authenticated",
// 			"x-token": token,
// 		};
// 	} catch {
// 		return getVisitorIdentity(c);
// 	}
// }

// export function setTokenCookie(c: Context, token: string) {
// 	setCookie(c, "rovodesk_widget_token", token, {
// 		httpOnly: true,
// 		sameSite: "Lax",
// 		secure: true,
// 		path: "/",
// 		maxAge: 60 * 60, // 1 hour
// 	});
// }

// export function extractToken(c: Context): string | null {
// 	return (
// 		c.req.header("Authorization")?.replace("Bearer ", "") ??
// 		c.req.header("x-token") ??
// 		c.req.query("token") ??
// 		getCookie(c, "rovodesk_widget_token") ??
// 		null
// 	);
// }

// // export async function validateApiKey(c: Context, apiKey: string) {
// // 	const auth = await createAuth(
// // 		c.env.CACHE_STORE,
// // 		c.get("Analytics"),
// // 		c.get("Logger")
// // 	);

// // 	const data = await auth.api.verifyApiKey({
// // 		body: { key: apiKey },
// // 	});

// // 	if (data.error) {
// // 		console.error(data.error);
// // 		throw new Error("Internal Server Error");
// // 	}

// // 	if (!data.valid) {
// // 		throw new Error("Invalid API Key");
// // 	}
// // }

// export type WorkspaceSecrets = {
// 	apiKey: string;
// 	jwtSecret: string;
// 	hmacSecret: string;
// };

// /**
//  * Verify an Intercom-style HMAC signature.
//  * signature = HMAC-SHA256( hmacSecret, JSON.stringify(user) )
//  * Uses SubtleCrypto for timing-safe comparison.
//  */
// export async function verifySignature(
// 	user: Record<string, unknown>,
// 	signature: string,
// 	hmacSecret: string
// ): Promise<boolean> {
// 	if (!hmacSecret) return false;

// 	try {
// 		const enc = new TextEncoder();
// 		const key = await crypto.subtle.importKey(
// 			"raw",
// 			enc.encode(hmacSecret),
// 			{ name: "HMAC", hash: "SHA-256" },
// 			false,
// 			["sign", "verify"]
// 		);

// 		const payload = enc.encode(JSON.stringify(user));

// 		// Decode the provided signature (hex or base64)
// 		let sigBytes: Uint8Array;
// 		try {
// 			// Try hex first (most common for Intercom-style)
// 			sigBytes = new Uint8Array(
// 				signature.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16))
// 			);
// 		} catch {
// 			// Fall back to base64
// 			const bin = atob(signature);
// 			sigBytes = new Uint8Array(bin.length);
// 			for (let i = 0; i < bin.length; i++) {
// 				sigBytes[i] = bin.charCodeAt(i);
// 			}
// 		}

// 		return await crypto.subtle.verify("HMAC", key, sigBytes, payload);
// 	} catch {
// 		return false;
// 	}
// }

// export async function signShortLivedToken(
// 	orgId: string,
// 	user: any,
// 	/**
// 	 * @deprecated accessKey is no longer used as the JWT secret.
// 	 * Pass jwtSecret explicitly. This parameter is kept for call-site
// 	 * backward compatibility and is ignored when jwtSecret is provided.
// 	 */
// 	accessKey: string,
// 	jwtSecret?: string
// ): Promise<string> {
// 	const secret = jwtSecret ?? accessKey; // safe migration: callers that already pass jwtSecret use it; old callers fall back
// 	return await signJWTToken(
// 		{
// 			keyId: crypto.randomUUID(),
// 			orgId,
// 			// ⚠️ Do NOT embed PII (email/name/avatar) in token — derive from DB on verify
// 			role: "authenticated",
// 		},
// 		secret,
// 		"1h",
// 		"http://localhost:5001",
// 		user.id as string,
// 		`organization:${orgId},user:${user.id},role:authenticated`
// 	);
// }

// // export async function verifyWidgetToken(c: Context): Promise<{
// // 	user: {
// // 		id: string;
// // 	};
// // 	orgId: string;
// // 	role: string;
// // } | null> {
// // 	const token = extractToken(c);
// // 	if (!token) {
// // 		throw new AuthError(401, "No token provided");
// // 	}

// // 	// 🔐 NEVER trust query params for org identity — only headers (set by server-side)
// // 	const workspaceId = c.req.header("x-org-id");
// // 	if (!workspaceId) {
// // 		throw new AuthError(400, "Missing workspace identity");
// // 	}

// // 	// Fetch per-workspace jwtSecret (falls back to shared JWT_SECRET env var)
// // 	// const secrets = await getWorkspaceSecrets(c, workspaceId);

// // 	// Verify token with workspace-scoped secret
// // 	// const payload = await verifyJWTToken(token, secrets.jwtSecret);
// // 	// if (!payload) {
// // 	// 	return null;
// // 	// }

// // 	// Validate required claims — NEVER trust email/name/avatar from token
// // 	if (
// // 		typeof payload.sub !== "string" ||
// // 		typeof payload.orgId !== "string" ||
// // 		typeof payload.role !== "string"
// // 	) {
// // 		throw new AuthError(401, "Invalid token claims");
// // 	}

// // 	// Org binding check — token must belong to the requesting workspace
// // 	if (payload.orgId !== workspaceId) {
// // 		throw new AuthError(401, "Token org mismatch");
// // 	}

// // 	return {
// // 		// ✅ Only expose id from JWT — never PII from token payload
// // 		user: {
// // 			id: payload.sub as string,
// // 		},
// // 		orgId: payload.orgId as string,
// // 		role: payload.role as string,
// // 	};
// // }
