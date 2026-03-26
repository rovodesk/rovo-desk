import { createAuth } from "@zero-heads-lab/auth/server/better-auth";
import { Hono } from "hono";
import { AuthError } from "../lib/errors/auth.error";
import type { Bindings, Variables } from "../types";

export const authRoute = new Hono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

authRoute.on(["POST", "GET"], "/:path{.*}", async (c) => {
	const analytics = c.get("ANALYTICS");
	const logger = c.get("LOGGER");
	const tracer = c.get("TRACER");
	const database = c.get("DATABASE");
	const cache = c.env.CACHE_STORE;

	return await tracer.withSpan("auth.handler", async (span) => {
		const path = c.req.param("path");

		// Add metadata to the span for easier debugging in CF Dashboard
		span.setAttribute("auth.path", path);
		span.setAttribute("auth.method", c.req.method);

		const auth = await createAuth(cache, database, analytics, logger);

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
