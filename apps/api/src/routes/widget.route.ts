import { WidgetRepository } from "@zero-heads-lab/database/repositories/widget";
import { WIDGET_INIT_REQUEST } from "@zero-heads-lab/shared/contracts/api/widget";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import {
	signShortLivedToken,
	validateApiKey,
	// verifySignature,
} from "../lib/utils";
// import { widgetAuthMiddleware } from "../middlewares/widget.middleware";
import type { Bindings, Variables } from "../types";

export const widgetRoute = new Hono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

widgetRoute.post("/init", async (c) => {
	const json = await c.req.json().catch(() => null);
	if (!json) return c.json({ error: "Invalid JSON" }, 400);

	const parsed = WIDGET_INIT_REQUEST.safeParse(json);
	if (!parsed.success) {
		return c.json({ error: "Invalid request" }, 400);
	}

	const { organizationId } = parsed.data;

	const database = c.get("DATABASE");
	const tracer = c.get("TRACER");

	const repo = new WidgetRepository(database, tracer);

	// Load widget config
	const widget = await repo.query.getWidgetByOrganizationId({ organizationId });
	if (!widget) {
		return c.json(
			{ error: "Widget not found, please check your organizationId" },
			404
		);
	}

	return c.json({
		success: true,
		mode: "visitor",
		widgetConfig: widget.config,
	});
});

widgetRoute.post("/identify", async (c) => {
	const { user, organizationId, accessKey } = await c.req.json();

	if (!(organizationId && accessKey && user?.id)) {
		return c.json({ error: "Invalid request" }, 400);
	}

	// 🔑 Validate API key (unchanged)
	await validateApiKey(c, accessKey);

	// 🔐 Fetch per-workspace secrets (backward-compatible: falls back to JWT_SECRET env)
	// const secrets = await getWorkspaceSecrets(c, organizationId);

	// 🛡️ HMAC Identity Verification (Intercom-style)
	// If the workspace has an hmacSecret configured, the signature is REQUIRED.
	// This prevents impersonation of any end-user identity.
	// if (secrets.hmacSecret) {
	// 	if (!signature) {
	// 		return c.json({ error: "Signature required" }, 401);
	// 	}

	// 	// Strip the signature from the object before hashing so the payload is stable
	// 	const { signature: _sig, ...userPayload } = user;
	// 	const valid = await verifySignature(
	// 		userPayload,
	// 		signature,
	// 		secrets.hmacSecret
	// 	);
	// 	if (!valid) {
	// 		return c.json({ error: "Invalid identity signature" }, 401);
	// 	}
	// }

	// 🔐 Sign token using workspace jwtSecret (not API key)
	const token = await signShortLivedToken(
		organizationId,
		user,
		accessKey
		// secrets.jwtSecret
	);
	setCookie(c, "rovodesk_widget_token", token, {
		httpOnly: true,
		sameSite: "Lax",
		secure: true,
		path: "/",
		maxAge: 60 * 60,
	});

	return c.json({
		success: true,
		mode: "user",
		user,
		token,
	});
});

/**
 * sessionId = user?.id ? `user_${user.id}` : `visitor_${sessionId}`
 */
// widgetRoute.use("/chatroom/*", widgetAuthMiddleware);
widgetRoute.all("/chatroom/*", async (c) => {
	const identity = c.get("IDENTITY");

	const roomId =
		identity["x-role"] === "authenticated"
			? `user_${identity["x-user-id"]}`
			: `visitor_${identity["x-user-id"]}`;

	const id = c.env.CHAT_ROOM.idFromName(roomId);
	const stub = c.env.CHAT_ROOM.get(id);

	const headers = new Headers(c.req.raw.headers);

	headers.set("x-partykit-room", roomId);
	headers.set("x-partykit-namespace", "Chatroom");

	for (const [key, value] of Object.entries(identity)) {
		headers.set(key, value);
	}

	return await stub.fetch(new Request(c.req.raw, { headers }));
});
