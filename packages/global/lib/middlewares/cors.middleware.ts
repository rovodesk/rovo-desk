import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import type { WorkerEnv } from "../env";

export function createCorsMiddleware(
	allowedOrigins: string[]
): MiddlewareHandler<WorkerEnv> {
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
