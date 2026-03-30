import { Hono } from "hono";
import type { AppEnv } from "@/lib/context";

export const healthRouter = new Hono<AppEnv>();

// Use .all to capture all methods, but ensure the path matches your prefix logic
healthRouter.all("/health/*", (c) => {
	return c.json({
		status: "ok",
		timestamp: Date.now(),
	});
});
