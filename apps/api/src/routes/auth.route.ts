import type { IAnalytics } from "@zero-heads-lab/analytics/lib/analytics";
import type { ILogger } from "@zero-heads-lab/analytics/lib/logger";
import type { Tracer } from "@zero-heads-lab/analytics/lib/tracer";
import { createAuth } from "@zero-heads-lab/auth/server";
import { Hono } from "hono";
import { AuthError } from "../lib/errors/auth.error";
import type { Bindings, Variables } from "../types";

export const authRoute = new Hono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

authRoute.on(["POST", "GET"], "/:path{.*}", async (c) => {
	const analytics: IAnalytics = c.get("Analytics");
	const logger: ILogger = c.get("Logger");
	const tracer: Tracer = c.get("Tracer");

	return await tracer.withSpan("auth.handler", async (span) => {
		const path = c.req.param("path");

		// Add metadata to the span for easier debugging in CF Dashboard
		span.setAttribute("auth.path", path);
		span.setAttribute("auth.method", c.req.method);

		const auth = await createAuth(c.env.CACHE_STORE, analytics, logger);

		try {
			const response = await auth.handler(c.req.raw);
			span.setAttribute("http.status_code", response.status);
			return response;
		} catch (error) {
			if (error instanceof AuthError) {
				span.recordException(error);
				span.setStatus({ code: error.code, message: error.message });
				throw error;
			}
		}
	});
});
