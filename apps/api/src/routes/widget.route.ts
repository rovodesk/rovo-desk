import { KvCacheStore } from "@zero-heads-lab/cache";
import { signJWTToken, verifyJWTToken } from "@zero-heads-lab/crypto";
import { createDatabase } from "@zero-heads-lab/database";
import { getApiKeyByWorkspaceId } from "@zero-heads-lab/database/repositories/auth/queries";
import { getWorkspaceProfileByOrganizationId } from "@zero-heads-lab/database/repositories/profile/queries";
import { getWidgetByOrganizationId } from "@zero-heads-lab/database/repositories/widget/queries";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import type { JWTPayload } from "hono/utils/jwt/types";
import type { Bindings } from "../types";

export const widgetRoute = new Hono<{ Bindings: Bindings }>();

widgetRoute.use(
	"*",
	cors({
		origin: "*",
		// origin: "http://localhost:5500",
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"Access-Control-Allow-Origin",
		],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: [
			"Content-Length",
			"Content-Type",
			"Access-Control-Allow-Origin",
		],
		maxAge: 600,
	})
);

widgetRoute.post("/auth", async (c) => {
	const { user, organizationId, accessKey } = await c.req.json();
	if (!(user && organizationId && accessKey)) {
		return c.json({ error: "Invalid request" }, 400);
	}

	let key: string;
	// Get api Key from cache (fallback to db)
	const authCacheStore = new KvCacheStore(c.env.CACHE_STORE).withPrefix("auth");
	// biome-ignore lint/suspicious/noExplicitAny: Returns Any type
	const cachedKey = await authCacheStore.get<Record<string, any>>(accessKey);
	if (cachedKey?.key) {
		key = cachedKey.key;
	} else {
		const db = await createDatabase();
		const apiKeyFromDb = await getApiKeyByWorkspaceId(db, {
			workspaceId: organizationId,
		});
		if (!apiKeyFromDb) {
			return c.json({ error: "API Key not found" }, 404);
		}
		key = apiKeyFromDb.key;
		// Set API Key in cache for 1 hour
		await authCacheStore.set(accessKey, apiKeyFromDb, 60 * 60); // 1 hour
	}

	const token = await signJWTToken(
		{
			keyId: crypto.randomUUID(),
			orgId: organizationId,
			user,
			role: "authenticated",
		},
		key,
		"1h", // 1 hour
		"http://localhost:5001",
		user.id as string,
		`organization:${organizationId},user:${user.id},role:authenticated`
	);

	setCookie(c, "sdk_token", token, {
		httpOnly: true,
		sameSite: "Lax",
		secure: true,
		path: "/",
		maxAge: 60 * 60, // 1 hour
	});

	return c.json({ token });
});

widgetRoute.post("/init", async (c) => {
	const body = await c.req.json().catch(() => null);
	const jwtHeader = c.req.header("Authorization")?.toString();
	if (!body) {
		return c.json({ error: "Invalid JSON body" }, 400);
	}

	const { workspaceId, user } = body;
	const jwtSignedToken = jwtHeader?.split(" ")[1];
	if (!workspaceId) {
		return c.json({ error: "Missing credentials" }, 400);
	}

	const db = await createDatabase();

	// Validate OrganizationId
	const workspace = await getWorkspaceProfileByOrganizationId(db, {
		organizationId: workspaceId,
	});
	if (!workspace) {
		return c.json({ error: "Workspace not found" }, 404);
	}

	const [apiKey, widget] = await Promise.all([
		getApiKeyByWorkspaceId(db, { workspaceId }),
		getWidgetByOrganizationId(db, { organizationId: workspaceId }),
	]);

	// console.log(jwtSignedToken, apiKey?.key, widget);

	// Validate Customer Signed Token (ifPresent)
	if (jwtSignedToken && jwtSignedToken !== "") {
		// Fetch apiKey from Database
		const jwtSecret = apiKey?.key;
		if (!jwtSecret) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		// Verify Token
		const decodedToken: JWTPayload = await verifyJWTToken(
			jwtSignedToken,
			jwtSecret
		);
		if (!decodedToken) {
			return c.json({ error: "Invalid token" }, 401);
		}
		// // HMAC Verification ( if x-signature header is present)
		// const signature = c.req.header("x-signature");
		// if (signature) {
		// 	const expected = generateHmac(user.id, jwtSecret);
		// 	if (expected !== signature) {
		// 		return c.json({ error: "Invalid user signature" }, 401);
		// 	}
		// }
		if (
			decodedToken.role === "authenticated" &&
			(!user || decodedToken.sub !== user.id)
		) {
			return c.json({ error: "Invalid user token" }, 401);
		}
	}

	// Return Widget
	return c.json({
		success: true,
		widgetConfig: widget,
		mode: user ? "user" : "visitor",
		user,
	});
});

// widgetRoute.all("/chatroom/:connId", async (c) => {
// 	const connId = c.req.param("connId");
// 	if (!connId) return c.text("Missing connId", 400);

// 	const authCacheStore = new KvCacheStore(c.env.CACHE_STORE).withPrefix("auth");

// 	let token =
// 		c.req.query("token") ??
// 		c.req.header("authorization")?.replace("Bearer ", "") ??
// 		null;

// 	// Cookie fallback
// 	if (!token) {
// 		const cookie = c.req.header("cookie");
// 		const match = cookie?.match(/sdk_token=([^;]+)/);
// 		if (match) token = decodeURIComponent(match[1]);
// 	}

// 	// let identity: Record<string, string>;

// 	// // 🟣 ADMIN FLOW
// 	// if (token) {
// 	// 	// 🔐 SDK FLOW
// 	// 	let payload: JWTPayload;

// 	// 	try {
// 	// 		payload = await verifyJWTToken(token, c.env.SDK_JWT_SECRET);
// 	// 	} catch (error) {
// 	// 		console.error("JWT Verification Failed:", error);
// 	// 		return c.text("Unauthorized", 401);
// 	// 	}

// 	// 	if (
// 	// 		typeof payload.orgId !== "string" ||
// 	// 		typeof payload.connectionId !== "string" ||
// 	// 		typeof payload.role !== "string" ||
// 	// 		typeof payload.sub !== "string" ||
// 	// 		typeof payload.exp !== "number" ||
// 	// 		payload.exp * 1000 < Date.now()
// 	// 	) {
// 	// 		return c.text("Unauthorized", 401);
// 	// 	}

// 	// 	identity = {
// 	// 		"x-user-id": payload.sub,
// 	// 		"x-org-id": payload.orgId,
// 	// 		"x-connection-id": payload.connectionId,
// 	// 		"x-role": payload.role,
// 	// 	};
// 	// } else {
// 	// 	const session = await auth.api.getSession({
// 	// 		headers: c.req.raw.headers,
// 	// 	});

// 	// 	if (!session?.user) {
// 	// 		return c.text("Unauthorized", 401);
// 	// 	}

// 	// 	identity = {
// 	// 		"x-user-id": session.user.id,
// 	// 		"x-org-id": session.session.activeOrganizationId!,
// 	// 		"x-role": "admin",
// 	// 	};
// 	// }

// 	// Forward to Durable Object
// 	const id = c.env.CHAT_ROOM.idFromName(connId);
// 	const stub = c.env.CHAT_ROOM.get(id);

// 	const headers = new Headers(c.req.raw.headers);

// 	headers.set("x-partykit-room", connId);
// 	headers.set("x-partykit-namespace", "Chatroom");

// 	for (const [key, value] of Object.entries(identity)) {
// 		headers.set(key, value);
// 	}

// 	return await stub.fetch(new Request(c.req.raw, { headers }));
// });
