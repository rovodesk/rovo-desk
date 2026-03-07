import { createAuth } from "@zero-heads-lab/auth/server";
import { Hono } from "hono";
import { corsMiddleware } from "../middlewares/cors.middleware";
import type { Bindings } from "../types";

export const authRoute = new Hono<{ Bindings: Bindings }>();

authRoute.use("*", corsMiddleware);

// The catch-all Better Auth handler goes LAST
// Use :path{.*} to ensure all nested segments (like /sign-in/magic-link) are caught
authRoute.on(["POST", "GET"], "/:path{.*}", (c) => {
	const auth = createAuth(c.env.AUTH_CACHE);
	return auth.handler(c.req.raw);
});
