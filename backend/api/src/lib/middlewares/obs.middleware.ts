import { Analytics } from "@zero-heads-lab/analytics/lib/analytics";
import { Logger } from "@zero-heads-lab/analytics/lib/logger";
import { Tracer } from "@zero-heads-lab/analytics/lib/tracer";
import { createAnalyticsEnv } from "@zero-heads-lab/analytics/server/keys";
import { CacheStore } from "@zero-heads-lab/cache";
import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "@/lib/context";
import { getSpanID, resolveSecret } from "@/lib/utils";
import { name, version } from "../../../package.json";

export const observabilityMiddleware: MiddlewareHandler<AppEnv> = async (
	c,
	next
) => {
	const spanId = getSpanID(c);

	const posthogApiKey = await resolveSecret(c.env.POSTHOG_API_KEY);

	const analyticsEnv = createAnalyticsEnv({
		POSTHOG_API_KEY: posthogApiKey,
		POSTHOG_HOST: c.env.POSTHOG_HOST,
		LOG_LEVEL: c.env.LOG_LEVEL,
		ANALYTICS_ENABLED: c.env.ANALYTICS_ENABLED,
	});

	// 1. Init Cache
	const cache = new CacheStore(c.env.CACHE_STORE);

	// 2. Init Analytics
	const analytics = new Analytics({
		env: analyticsEnv,
		cacheStore: cache,
	});

	// 3. Create per-request logger
	const logger = new Logger({
		env: analyticsEnv,
		analytics,
	});

	// 4. Create per-request tracer
	const tracer = new Tracer({
		app: name,
		version,
		logger,
	});

	// Initial context
	logger.setContext({ spanId });

	c.set("CACHE", cache);
	c.set("ANALYTICS", analytics);
	c.set("LOGGER", logger);
	c.set("TRACER", tracer);

	const start = Date.now();

	// 🔥 Root span
	return await tracer.withSpan("http.request", async (span) => {
		const sc = span.spanContext();

		// ⚡️ LINK LOGS TO TRACES: Now every log called via c.get("Logger")
		// will automatically include the traceId and spanId.
		logger.setTraceContext(sc.traceId, sc.spanId);

		span.setAttribute("http.method", c.req.method);
		span.setAttribute("http.route", c.req.path);
		span.setAttribute("http.span_id", spanId);

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
