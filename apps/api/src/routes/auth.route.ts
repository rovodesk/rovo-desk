import { createAuth } from "@zero-heads-lab/auth/server";
import { Hono } from "hono";
import type { Bindings, Variables } from "../types";

export const authRoute = new Hono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

authRoute.on(["POST", "GET"], "/:path{.*}", async (c) => {
	const analytics = c.get("analytics");

	const auth = await createAuth(c.env.CACHE_STORE, analytics);
	console.log(`[AUTH] ${c.req.method} ${c.req.url}`);
	const response = await auth.handler(c.req.raw);
	console.log(`[AUTH] Response: ${response.status}`);
	return response;
});
