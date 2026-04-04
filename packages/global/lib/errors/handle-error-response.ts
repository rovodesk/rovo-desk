import { getTraceContext, SpanStatusCode } from "@zero-heads-lab/observability";
import type { Context } from "hono";
import type { WorkerEnv } from "lib/env";
import { resolveStatusCode } from "lib/errors";

export const handleErrorResponse = (
	err: Error | unknown,
	c: Context<WorkerEnv>
) => {
	// 1. Extract context
	const traceCtx = getTraceContext();
	const logger = c.env.logger;
	const span = c.get("span"); // Set in your Tracer Middleware

	// 2. Resolve Status and Exposure
	const status = resolveStatusCode(err);
	const isServerError = status >= 500;

	// 3. Update OTel Span
	if (span) {
		span.recordException(err instanceof Error ? err : new Error(String(err)));
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: err instanceof Error ? err.message : "Unknown Error",
		});
	}

	// 4. Correlate and Log
	const errorLogger =
		logger?.withTrace?.(traceCtx.traceId, traceCtx.spanId) ?? logger;
	errorLogger.error("request.error", {
		status,
		type: err instanceof Error ? err.name : "UnknownError",
		message: err instanceof Error ? err.message : String(err),
		stack: isServerError && err instanceof Error ? err.stack : undefined,
	});

	// 5. Response (Strictly sanitizing 500s)
	return c.json(
		{
			success: false,
			error: isServerError ? "Internal Server Error" : (err as Error).message,
			traceId: traceCtx.traceId, // Return this for client-side support tickets
		},
		// biome-ignore lint/suspicious/noExplicitAny: Hono's Context.json doesn't accept a number
		status as any
	);
};
