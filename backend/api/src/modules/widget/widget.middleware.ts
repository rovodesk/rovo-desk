// // import type { Analytics } from "@zero-heads-lab/analytics/lib/analytics";
// import type { MiddlewareHandler } from "hono";
// // import { verifyWidgetToken } from "../lib/utils";

// export const widgetAuthMiddleware: MiddlewareHandler = async (c, next) => {
// 	// const analytics: Analytics = c.get("Analytics");

// 	// let identity: {
// 	// 	"x-user-id": string;
// 	// 	"x-org-id": string;
// 	// 	"x-role": "authenticated" | "visitor";
// 	// };

// 	try {
// 		// 🔐 Authenticated user
// 		// const payload = await verifyWidgetToken(c);

// 		// if (!payload) {
// 		// 	throw new Error("Invalid widget token");
// 		// }

// 		// identity = {
// 		// 	"x-user-id": payload.user.id,
// 		// 	"x-org-id": payload.orgId,
// 		// 	"x-role": "authenticated", // ✅ NEVER trust payload.role
// 		// };
// 	// } catch (err) {
// 		// // 🔁 Visitor fallback (secure)

// 		// let sessionId = getCookie(c, "widget_session");

// 		// if (!sessionId) {
// 		// 	sessionId = `visitor_${crypto.randomUUID()}`;

// 		// 	setCookie(c, "widget_session", sessionId, {
// 		// 		httpOnly: false,
// 		// 		sameSite: "Lax",
// 		// 		secure: true,
// 		// 		path: "/",
// 		// 		maxAge: 60 * 60 * 24 * 7,
// 		// 	});
// 		// }

// 		// // 🔐 NEVER trust query params for org identity — use header only
// 		// const orgId = c.req.header("x-org-id") ?? "visitor";

// 		// identity = {
// 		// 	"x-user-id": sessionId,
// 		// 	"x-org-id": orgId,
// 		// 	"x-role": "visitor",
// 		// };

// 		// // 📉 Log error
// 		// try {
// 		// 	if (err instanceof Error) {
// 		// 		await analytics.captureException(err, undefined, {
// 		// 			properties: { error: err.message },
// 		// 		});
// 		// 	}
// 		// } catch {
// 		// 	// Ignore
// 		// }
// 	}

// 	// // 📊 Analytics
// 	// try {
// 	// 	await analytics.identify({
// 	// 		distinctId: identity["x-user-id"],
// 	// 		properties: {
// 	// 			user_id: identity["x-user-id"],
// 	// 			org_id: identity["x-org-id"],
// 	// 			role: identity["x-role"] === "authenticated" ? "user" : "visitor",
// 	// 		},
// 	// 	});
// 	// } catch {
// 	// 	// Ignore
// 	// }

// 	// c.set("Identity", identity);

// 	// await next();
// };
