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

		const requestLogger = logger.withContext({
			requestId,
			method: c.req.method,
			path: c.req.path,
		});

		c.set("logger", requestLogger);

		await next();

		const traceCtx = getTraceContext();
		const correlatedLogger = requestLogger.withTrace(
			traceCtx.traceId,
			traceCtx.spanId
		);

		const duration = Date.now() - start;

		if (c.res.status >= 400) {
			correlatedLogger.warn("request.failed", {
				status: c.res.status,
				durationMs: duration,
			});
		} else {
			correlatedLogger.info("request.completed", {
				status: c.res.status,
				durationMs: duration,
			});
		}
	};
}
