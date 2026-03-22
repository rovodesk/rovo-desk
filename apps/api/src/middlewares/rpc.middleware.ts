import { getAnalyticsClient } from "@zero-heads-lab/analytics/server";
import { createAuth } from "@zero-heads-lab/auth/server";
import { createDatabase } from "@zero-heads-lab/database";
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
	const analytics = await getAnalyticsClient(
		c.env.CACHE_STORE,
		c.env.POSTHOG_PROJECT_API_KEY
	);
	const auth = await createAuth(c.env.CACHE_STORE, analytics);
	const database = await createDatabase();

	const { matched, response } = await orpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: {
			auth,
			analytics,
			database,
			reqHeaders: c.req.raw.headers,
		},
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
};
