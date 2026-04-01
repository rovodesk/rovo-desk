import type { ILogger } from "@zero-heads-lab/observability";
import { getTraceContext } from "@zero-heads-lab/observability";
import type { Context, MiddlewareHandler } from "hono";
import type { GlobalEnv } from "../env";

function getOrCreateRequestId(c: Context) {
	return (
		c.req.header("x-request-id") ??
		c.req.header("cf-ray") ??
		crypto.randomUUID()
	);
}

export function createLoggerMiddleware(
	logger: ILogger
): MiddlewareHandler<GlobalEnv> {
	return async (c, next) => {
		const requestId = getOrCreateRequestId(c);
		const start = Date.now();
		const traceCtx = getTraceContext();

		const requestLogger = logger
			.withContext({
				requestId,
				method: c.req.method,
				path: c.req.path,
			})
			.withTrace(traceCtx.traceId, traceCtx.spanId);

		c.set("logger", requestLogger);

		try {
			await next();

			requestLogger.info("request.completed", {
				status: c.res.status,
				durationMs: Date.now() - start,
			});
		} catch (error) {
			requestLogger.error("request.failed", error, {
				durationMs: Date.now() - start,
			});
			throw error;
		}
	};
}
