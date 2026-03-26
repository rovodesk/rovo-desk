import { createAuth } from "@zero-heads-lab/auth/server/better-auth";
import { orpcHandler } from "@zero-heads-lab/transport/server";
import type { MiddlewareHandler } from "hono";
import type { Bindings, Variables } from "../types";

export const rpcMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
	Variables: Variables;
}> = async (c, next) => {
	const tracer = c.get("TRACER");
	const logger = c.get("LOGGER");
	const analytics = c.get("ANALYTICS");
	const database = c.get("DATABASE");
	const cache = c.env.CACHE_STORE;

	// 1. Wrap the entire RPC execution in a span
	return await tracer.withSpan("rpc.handler", async (span) => {
		const path = new URL(c.req.url).pathname;
		span.setAttribute("rpc.path", path);

		// 2. Reuse or Contextualize Dependencies
		// We pass the request-scoped logger so DB queries are linked to this RPC trace

		const auth = await createAuth(cache, database, analytics, logger, tracer);

		const { matched, response } = await orpcHandler.handle(c.req.raw, {
			prefix: "/rpc",
			context: {
				auth,
				analytics,
				database,
				reqHeaders: c.req.raw.headers,
				// Pass the tracer/logger into the RPC context so procedures can create sub-spans
				logger: logger.derive({ component: "rpc", path }),
				tracer,
			},
		});

		if (matched) {
			span.setAttribute("http.status_code", response.status);

			// Log the RPC completion specifically
			logger.info("rpc.completed", {
				path,
				status: response.status,
			});

			return c.newResponse(response.body, response);
		}

		return await next();
	});
};
