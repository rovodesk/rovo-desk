import { createAuth } from "@zero-heads-lab/auth/server";
import { verifyJWTToken } from "@zero-heads-lab/crypto";
import { createDatabase } from "@zero-heads-lab/database";
import { getApiKeyByWorkspaceId } from "@zero-heads-lab/database/repositories/auth/queries";
import { getWorkspaceProfileByOrganizationId } from "@zero-heads-lab/database/repositories/profile/queries";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { JWTPayload } from "hono/utils/jwt/types";
import { canvasSchema } from "../../../../packages/engine/validations/canvas";
import { buildInitialCanvas } from "../lib/utils";
import type { Bindings } from "../types";

export const widgetRoute = new Hono<{ Bindings: Bindings }>();

widgetRoute.use(
	"*",
	cors({
		origin: "*",
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	})
);

widgetRoute.post("/init", async (c) => {
	const body = await c.req.json().catch(() => null);
	const jwtHeader = c.req.header("Authorization")?.toString();
	if (!body) {
		return c.json({ error: "Invalid JSON body" }, 400);
	}

	const { workspaceId, user } = body;
	const customerSignedToken = jwtHeader?.split(" ")[1];
	if (!workspaceId) {
		return c.json({ error: "Missing credentials" }, 400);
	}

	const db = createDatabase();

	// Validate OrganizationId
	const workspace = await getWorkspaceProfileByOrganizationId(db, {
		organizationId: workspaceId,
	});
	if (!workspace) {
		return c.json({ error: "Workspace not found" }, 404);
	}

	// Validate Customer Signed Token (ifPresent)
	if (customerSignedToken && customerSignedToken !== "") {
		// Fetch apiKey from Database
		const apiKey = await getApiKeyByWorkspaceId(db, {
			workspaceId,
		});
		const jwtSecret = apiKey?.key;
		if (!jwtSecret) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		// Verify Token
		const decodedToken = await verifyJWTToken(customerSignedToken, jwtSecret);
		if (!decodedToken) {
			return c.json({ error: "Invalid token" }, 401);
		}
	}

	// HMAC Verification ( if x-signature header is present)
	// const signature = c.req.header("x-signature");
	// if (signature) {
	// 	const expected = generateHmac(user.id, org.secretKey);
	// 	if (expected !== signature) {
	// 		return c.json({ error: "Invalid user signature" }, 401);
	// 	}
	// }

	// Build Canvas
	const canvas = buildInitialCanvas({
		workspace,
		user,
	});

	// Validate Canvas
	const parsed = canvasSchema.safeParse({ canvas });

	if (!parsed.success) {
		console.error(parsed.error);
		return c.json({ error: "Invalid canvas generated" }, 500);
	}

	// Return Canvas
	return c.json({
		success: true,
		canvas,
	});
});

// widgetRoute.post("/auth", async (c) => {
// 	const { orgId } = await c.req.json();
// 	const publicKey = c.req.header("x-public-key");
// 	const secretKey = c.req.header("x-secret-key");

// 	if (!orgId || typeof orgId !== "string") {
// 		return c.json({ error: "Invalid request" }, 400);
// 	}
// 	if (secretKey && typeof secretKey !== "string") {
// 		return c.json({ error: "Invalid request" }, 400);
// 	}
// 	if (publicKey && typeof publicKey !== "string") {
// 		return c.json({ error: "Invalid request" }, 400);
// 	}

// 	// When both keys are present
// 	if (publicKey && secretKey) {
// 		return c.json({ error: "Invalid request" }, 400);
// 	}

// 	let result: boolean;
// 	const auth = createAuth(c.env.AUTH_CACHE);

// 	if (publicKey) {
// 		//@ts-expect-error no public key verification in better-auth
// 		result = await auth.api.verifyKey({
// 			body: {
// 				key: publicKey,
// 				configId: "public",
// 			},
// 		});
// 	} else if (secretKey) {
// 		//@ts-expect-error no secret key verification in better-auth
// 		result = await auth.api.verifyKey({
// 			body: {
// 				key: secretKey,
// 				configId: "secret",
// 			},
// 		});
// 	} else {
// 		return c.json({ error: "Invalid request" }, 400);
// 	}

// 	let token: string | undefined;
// 	if (result) {
// 		// Issue JWT token for anonymous user
// 		token = await issueAnonymousSDKToken(orgId, c.env.SDK_JWT_SECRET);
// 		// Set cookie for the token
// 		setCookie(c, "sdk_token", token, {
// 			httpOnly: true,
// 			sameSite: "Lax",
// 			secure: true,
// 			path: "/",
// 			maxAge: 15 * 60, // 15 minutes
// 		});
// 	}
// 	// Return chatroom URL
// 	return c.json({
// 		authToken: token,
// 		chatroomUrl: `/sdk/chatroom/${orgId}`,
// 	});
// });

// widgetRoute.post("/auth/authenticated", async (c) => {
// 	const { connId, orgId, user, signature } = await c.req.json();
// 	if (
// 		!(connId && orgId && user && signature) ||
// 		typeof connId !== "string" ||
// 		typeof orgId !== "string" ||
// 		typeof user !== "object" ||
// 		typeof user.id !== "string" ||
// 		typeof signature !== "string" ||
// 		!validateUUID(connId)
// 	) {
// 		return c.json({ error: "Invalid request" }, 400);
// 	}

// 	const db = createDatabase();
// 	// Check if connection is enabled
// 	const connection = await getSDKConnectionById(db, {
// 		connectionId: connId,
// 	});
// 	if (!connection?.isActive) {
// 		return c.json({ error: "Connection disabled" }, 404);
// 	}
// 	// Get Active Public Key
// 	const keyRecord = await getActivePublicKeyByConnectionId(db, {
// 		connectionId: connId,
// 	});
// 	if (!keyRecord?.publicKey) {
// 		return c.json({ error: "Connection not found" }, 400);
// 	}

// 	// Verify signature and jwt token for provided user payload
// 	const crypto = new AsymmetricCrypto();
// 	const verified = crypto.verify(
// 		keyRecord.publicKey,
// 		JSON.stringify(user),
// 		signature
// 	);
// 	if (!verified) {
// 		return c.json({ error: "JWT Verification Failed" }, 401);
// 	}

// 	// Issue JWT token for authenticated user
// 	const token = await issueAuthenticatedSDKToken(
// 		orgId,
// 		connId,
// 		user,
// 		c.env.SDK_JWT_SECRET
// 	);
// 	// Set cookie for the token
// 	setCookie(c, "sdk_token", token, {
// 		httpOnly: true,
// 		sameSite: "Lax",
// 		secure: true,
// 		path: "/",
// 		maxAge: 30 * 60, // 30 minutes
// 	});
// 	// Return chatroom URL
// 	return c.json({
// 		authToken: token,
// 		chatroomUrl: `/sdk/chatroom/${connId}`,
// 	});
// });

widgetRoute.all("/chatroom/:connId", async (c) => {
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
