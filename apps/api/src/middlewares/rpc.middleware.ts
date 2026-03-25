import { createAuth } from "@zero-heads-lab/auth/server";
import { createDatabase } from "@zero-heads-lab/database";
import { orpcHandler } from "@zero-heads-lab/transport/server";
import type { MiddlewareHandler } from "hono";
import type { Bindings, Variables } from "../types";

export const rpcMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
	Variables: Variables;
}> = async (c, next) => {
	const tracer = c.get("Tracer");
	const logger = c.get("Logger");
	const analytics = c.get("Analytics");

	// 1. Wrap the entire RPC execution in a span
	return await tracer.withSpan("rpc.handler", async (span) => {
		const path = new URL(c.req.url).pathname;
		span.setAttribute("rpc.path", path);

		// 2. Reuse or Contextualize Dependencies
		// We pass the request-scoped logger so DB queries are linked to this RPC trace
		const auth = await createAuth(c.env.CACHE_STORE, analytics, logger);
		const database = await createDatabase(c.env.DATABASE_URL, logger);
		const tracer = c.get("Tracer");

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
