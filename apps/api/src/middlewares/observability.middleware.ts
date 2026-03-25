import { Analytics } from "@zero-heads-lab/analytics/lib/analytics";
import { Logger } from "@zero-heads-lab/analytics/lib/logger";
import { SpanID, Tracer } from "@zero-heads-lab/analytics/lib/tracer";
import type { MiddlewareHandler } from "hono";
import { name, version } from "../../package.json";
import type { Bindings, Variables } from "../types";

export const observabilityMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
	Variables: Variables;
}> = async (c, next) => {
	const rayId = c.req.header("cf-ray") || SpanID();

	// 1. Init Analytics
	const analytics = new Analytics({
		flagCache: c.env.CACHE_STORE,
		posthogApiKey: c.env.POSTHOG_PROJECT_API_KEY,
		posthogHost: c.env.POSTHOG_HOST,
	});

	// 2. Create per-request logger
	const logger = new Logger({
		logLevel: c.env.LOG_LEVEL,
		enableAnalytics: c.env.ANALYTICS_ENABLED === "true",
		analytics,
	});

	const tracer = new Tracer(name, version, logger);

	// Initial context
	logger.setContext({ rayId });

	c.set("Analytics", analytics);
	c.set("Logger", logger);
	c.set("Tracer", tracer);

	const start = Date.now();

	// 🔥 Root span
	return await tracer.withSpan("http.request", async (span) => {
		const sc = span.spanContext();

		// ⚡️ LINK LOGS TO TRACES: Now every log called via c.get("Logger")
		// will automatically include the traceId and spanId.
		logger.setTraceContext(sc.traceId, sc.spanId);

		span.setAttribute("http.method", c.req.method);
		span.setAttribute("http.route", c.req.path);
		span.setAttribute("cloudflare.ray_id", rayId);

		try {
			await next();

			// Capture the status code after the handlers have run
			span.setAttribute("http.status_code", c.res.status);

			const duration = Date.now() - start;

			logger.info("request.completed", {
				type: "request",
				method: c.req.method,
				path: c.req.path,
				status: c.res.status,
				duration: `${duration}ms`,
			});
		} catch (err) {
			span.setAttribute("http.error", true);
			// Logger.error handles analytics.captureException internally
			logger.error("request.failed", err, { path: c.req.path });
			throw err;
		} finally {
			// Ensure analytics flushes before the Worker isolate potentially shuts down
			c.executionCtx.waitUntil(analytics.shutdown());
		}
	});
};
