import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../lib/utils";
import type { Bindings } from "../types";

/**
 * CORS middleware
 */
export const corsMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
	// biome-ignore lint/suspicious/useAwait: No Awaited Funcrion
}> = async (c, _next) => {
	const handler = cors({
		origin: (requestOrigin, c) => {
			const allowed = getAllowedOrigins(c);
			return allowed.includes(requestOrigin) ? requestOrigin : null;
		},
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"x-csrf-token",
			"x-access-key",
		],
		allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	});

	return handler(c, _next);
};
