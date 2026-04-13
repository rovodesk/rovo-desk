import type {
	IAnalytics,
	ILogger,
	ITracer,
} from "@zero-heads-lab/analytics/types";
import type { AuthInstance } from "@zero-heads-lab/auth/types";
import type { Database } from "@zero-heads-lab/database";
import type { MiddlewareHandler } from "hono";
import { orpcHandler } from "@/lib/orpc-handler";
import type { AppEnv } from "../context";

export const rpcMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
	const tracer: ITracer = c.get("TRACER");
	const logger: ILogger = c.get("LOGGER");
	const analytics: IAnalytics = c.get("ANALYTICS");
	const database: Database = c.get("DATABASE");
	const auth: AuthInstance = c.get("AUTH");

	// 1. Wrap the entire RPC execution in a span
	return await tracer.withSpan("rpc.handler", async (span) => {
		const path = new URL(c.req.url).pathname;
		span.setAttribute("rpc.path", path);

		const { matched, response } = await orpcHandler.handle(c.req.raw, {
			prefix: "/rpc",
			context: {
				auth,
				analytics,
				database,
				headers: c.req.raw.headers,
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
