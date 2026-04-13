import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import type { AppEnv } from "../context";
import { getAllowedOrigins } from "../utils";

export const corsMiddleware: MiddlewareHandler<AppEnv> = (c, next) => {
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

	return handler(c, next);
};
