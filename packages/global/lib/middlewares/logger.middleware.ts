import type { ILogger } from "@zero-heads-lab/observability";
import { getTraceContext } from "@zero-heads-lab/observability";
import type { Context, MiddlewareHandler } from "hono";
import type { WorkerEnv } from "../env";

function getOrCreateRequestId(c: Context) {
	return (
		c.req.header("x-request-id") ??
		c.req.header("cf-ray") ??
		crypto.randomUUID()
	);
}

export function createLoggerMiddleware(
	logger: ILogger
): MiddlewareHandler<WorkerEnv> {
	return async (c, next) => {
		const requestId = getOrCreateRequestId(c);
		const start = Date.now();

		// Base logger with request metadata
		const requestLogger = logger.withContext({
			requestId,
			method: c.req.method,
			path: c.req.path,
		});

		// CRITICAL: We don't getTraceContext here yet,
		// because we want to give 'next()' a chance to enter the Tracer's span.

		c.env.logger = requestLogger;

		try {
			await next();

			// NOW we grab the trace context, once the span is guaranteed active
			const traceCtx = getTraceContext();
			const correlatedLogger = requestLogger.withTrace(
				traceCtx.traceId,
				traceCtx.spanId
			);

			const duration = Date.now() - start;

			if (c.res.status >= 400) {
				correlatedLogger.error("request.failed", {
					status: c.res.status,
					durationMs: duration,
				});
			} else {
				correlatedLogger.info("request.completed", {
					status: c.res.status,
					durationMs: duration,
				});
			}
		} catch (error) {
			const traceCtx = getTraceContext();
			const correlatedLogger = requestLogger.withTrace(
				traceCtx.traceId,
				traceCtx.spanId
			);

			correlatedLogger.error("request.exception", {
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
				durationMs: Date.now() - start,
			});
			throw error;
		}
	};
}
