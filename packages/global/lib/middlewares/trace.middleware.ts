import type { ITracer } from "@zero-heads-lab/observability";
import type { Context, MiddlewareHandler } from "hono";
import type { GlobalEnv } from "../env";

function generateRequestId() {
	return crypto.randomUUID();
}

function getRequestId(c: Context<GlobalEnv>) {
	return (
		c.req.header("cf-ray") || `${c.env.CLOUDFLARE_ENV}-${generateRequestId()}`
	);
}

export function createTracerMiddleware(
	tracer: ITracer
): MiddlewareHandler<GlobalEnv> {
	return async (c, next) => {
		const requestId = getRequestId(c);
		const start = Date.now();
		// Tracer with injected app metadata

		c.set("tracer", tracer);

		return await tracer.withSpan(
			"http.request",
			async (span) => {
				c.set("span", span);
				span.setAttribute("http.method", c.req.method);
				span.setAttribute("http.route", c.req.path);
				span.setAttribute("http.request_id", requestId);

				try {
					await next();

					span.setAttribute("http.status_code", c.res.status);
					const duration = Date.now() - start;
					span.setAttribute("http.duration", duration);
				} catch (err) {
					span.setAttribute("http.error", true);
					throw err;
				}
			},
			{
				"http.method": c.req.method,
				"http.route": c.req.path,
				"http.request_id": requestId,
			}
		);
	};
}
