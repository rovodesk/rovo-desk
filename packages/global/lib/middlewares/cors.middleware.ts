import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import type { GlobalEnv } from "../env";

export function createCorsMiddleware(
	allowedOrigins: string[]
): MiddlewareHandler<GlobalEnv> {
	return cors({
		origin: (requestOrigin) => {
			return allowedOrigins.includes(requestOrigin) ? requestOrigin : null;
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
}
