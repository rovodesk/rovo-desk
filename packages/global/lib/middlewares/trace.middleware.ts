import type { ITracer } from "@zero-heads-lab/observability";
import type { MiddlewareHandler } from "hono";
import type { WorkerEnv } from "../env";

export function createTracerMiddleware(
	tracer: ITracer // Use the concrete class or updated interface
): MiddlewareHandler<WorkerEnv> {
	return async (c, next) => {
		// Put tracer in env
		c.env.tracer = tracer;
		// Extract context from incoming request headers
		const parentContext = tracer.extractContext(c.req.header());
		const params = c.req.param();
		const path = c.req.path;
		const method = c.req.method;

		return await tracer.withSpan(
			`http.request.${method}.${path}`, // name
			async (span, ctx) => {
				// function
				// Store BOTH in Hono context
				c.set("span", span);
				c.set("ctx", ctx);
				c.set("requestId", c.req.header("cf-ray") ?? crypto.randomUUID());

				await next();

				span.setAttribute("http.status_code", c.res.status);
			},
			{
				"http.method": method,
				"http.path": path,
				"http.params": JSON.stringify(params),
			},
			parentContext
		);
	};
}
