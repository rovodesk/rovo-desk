import { createAuth } from "@zero-heads-lab/auth/server";
import { Hono } from "hono";
import type { Bindings, Variables } from "../types";

export const authRoute = new Hono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

// The catch-all Better Auth handler goes LAST
// Use :path{.*} to ensure all nested segments (like /sign-in/magic-link) are caught
authRoute.on(["POST", "GET"], "/:path{.*}", async (c) => {
	const analytics = c.get("analytics");

	const auth = createAuth(c.env.CACHE_STORE, analytics);
	return await auth.handler(c.req.raw);
});
