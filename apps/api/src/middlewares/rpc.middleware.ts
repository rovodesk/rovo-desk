import { createAuth } from "@zero-heads-lab/auth/server";
import { orpcHandler } from "@zero-heads-lab/transport/server";
import type { MiddlewareHandler } from "hono";
import type { Bindings } from "../types";

/**
 * ORPC middleware
 * Handles all /rpc/* requests
 */
export const rpcMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
}> = async (c, next) => {
	const { matched, response } = await orpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: {
			auth: createAuth(c.env.AUTH_CACHE),
			reqHeaders: c.req.raw.headers,
		},
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
};
