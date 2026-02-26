import { createAuth } from "@zero-heads-lab/auth/server";
import {
	AsymmetricCrypto,
	issueAnonymousSDKToken,
	issueAuthenticatedSDKToken,
	verifyJWTToken,
} from "@zero-heads-lab/crypto";
import { createDatabase } from "@zero-heads-lab/database";
import {
	getActivePublicKeyByConnectionId,
	getSDKConnectionById,
} from "@zero-heads-lab/database/repositories/sdk/queries";
import { validateUUID } from "@zero-heads-lab/shared/utils";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import type { JWTPayload } from "hono/utils/jwt/types";
import type { Bindings } from "../types";

export const sdkRoute = new Hono<{ Bindings: Bindings }>();

sdkRoute.post("/auth/anonymous", async (c) => {
	const { connId, orgId } = await c.req.json();
	const publicKey = c.req.header("x-public-key");

	if (
		!(connId && orgId) ||
		typeof connId !== "string" ||
		typeof orgId !== "string" ||
		!validateUUID(connId) ||
		!publicKey ||
		typeof publicKey !== "string"
	) {
		return c.json({ error: "Invalid request" }, 400);
	}
	const db = createDatabase();
	// Check if connection is enabled
	const connection = await getSDKConnectionById(db, {
		connectionId: connId,
	});
	if (!connection?.isActive) {
		return c.json({ error: "Connection disabled" }, 404);
	}
	// Get Active Public Key and match with the incoming public key
	const activePublicKey = await getActivePublicKeyByConnectionId(db, {
		connectionId: connId,
	});
	if (!activePublicKey?.publicKey) {
		return c.json({ error: "Public Key not found" }, 404);
	}
	if (activePublicKey.publicKey !== publicKey) {
		return c.json({ error: "Public Key does not match" }, 401);
	}

	// Issue JWT token for anonymous user
	const token = await issueAnonymousSDKToken(
		orgId,
		connId,
		c.env.SDK_JWT_SECRET
	);
	// Set cookie for the token
	setCookie(c, "sdk_token", token, {
		httpOnly: true,
		sameSite: "Lax",
		secure: true,
		path: "/",
		maxAge: 15 * 60, // 15 minutes
	});
	// Return chatroom URL
	return c.json({
		authToken: token,
		chatroomUrl: `/sdk/chatroom/${connId}`,
	});
});

sdkRoute.post("/auth/authenticated", async (c) => {
	const { connId, orgId, user, signature } = await c.req.json();
	if (
		!(connId && orgId && user && signature) ||
		typeof connId !== "string" ||
		typeof orgId !== "string" ||
		typeof user !== "object" ||
		typeof user.id !== "string" ||
		typeof signature !== "string" ||
		!validateUUID(connId)
	) {
		return c.json({ error: "Invalid request" }, 400);
	}

	const db = createDatabase();
	// Check if connection is enabled
	const connection = await getSDKConnectionById(db, {
		connectionId: connId,
	});
	if (!connection?.isActive) {
		return c.json({ error: "Connection disabled" }, 404);
	}
	// Get Active Public Key
	const keyRecord = await getActivePublicKeyByConnectionId(db, {
		connectionId: connId,
	});
	if (!keyRecord?.publicKey) {
		return c.json({ error: "Connection not found" }, 400);
	}

	// Verify signature and jwt token for provided user payload
	const crypto = new AsymmetricCrypto();
	const verified = crypto.verify(
		keyRecord.publicKey,
		JSON.stringify(user),
		signature
	);
	if (!verified) {
		return c.json({ error: "JWT Verification Failed" }, 401);
	}

	// Issue JWT token for authenticated user
	const token = await issueAuthenticatedSDKToken(
		orgId,
		connId,
		user,
		c.env.SDK_JWT_SECRET
	);
	// Set cookie for the token
	setCookie(c, "sdk_token", token, {
		httpOnly: true,
		sameSite: "Lax",
		secure: true,
		path: "/",
		maxAge: 30 * 60, // 30 minutes
	});
	// Return chatroom URL
	return c.json({
		authToken: token,
		chatroomUrl: `/sdk/chatroom/${connId}`,
	});
});

sdkRoute.all("/chatroom/:connId", async (c) => {
	const connId = c.req.param("connId");
	if (!connId) return c.text("Missing connId", 400);

	const auth = createAuth(c.env.AUTH_CACHE);

	let token =
		c.req.query("token") ??
		c.req.header("authorization")?.replace("Bearer ", "") ??
		null;

	// Cookie fallback
	if (!token) {
		const cookie = c.req.header("cookie");
		const match = cookie?.match(/sdk_token=([^;]+)/);
		if (match) token = decodeURIComponent(match[1]);
	}

	let identity: Record<string, string>;

	// 🟣 ADMIN FLOW
	if (token) {
		// 🔐 SDK FLOW
		let payload: JWTPayload;

		try {
			payload = await verifyJWTToken(token, c.env.SDK_JWT_SECRET);
		} catch (error) {
			console.error("JWT Verification Failed:", error);
			return c.text("Unauthorized", 401);
		}

		if (
			typeof payload.orgId !== "string" ||
			typeof payload.connectionId !== "string" ||
			typeof payload.role !== "string" ||
			typeof payload.sub !== "string" ||
			typeof payload.exp !== "number" ||
			payload.exp * 1000 < Date.now()
		) {
			return c.text("Unauthorized", 401);
		}

		identity = {
			"x-user-id": payload.sub,
			"x-org-id": payload.orgId,
			"x-connection-id": payload.connectionId,
			"x-role": payload.role,
		};
	} else {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session?.user) {
			return c.text("Unauthorized", 401);
		}

		identity = {
			"x-user-id": session.user.id,
			"x-org-id": session.session.activeOrganizationId!,
			"x-role": "admin",
		};
	}

	// Forward to Durable Object
	const id = c.env.CHAT_ROOM.idFromName(connId);
	const stub = c.env.CHAT_ROOM.get(id);

	const headers = new Headers(c.req.raw.headers);

	headers.set("x-partykit-room", connId);
	headers.set("x-partykit-namespace", "Chatroom");

	for (const [key, value] of Object.entries(identity)) {
		headers.set(key, value);
	}

	return stub.fetch(new Request(c.req.raw, { headers }));
});
