import type { ITracer } from "@zero-heads-lab/analytics/types";
import { Hono } from "hono";
import type { AppEnv, BaseContext } from "@/lib/context";
import { orpcHandler } from "@/lib/orpc-handler"; // This should be your ORPC server instance
import { AuthError } from "../../lib/errors/auth.error";

export const rpcRouter = new Hono<AppEnv>();

// Use .all to capture all methods, but ensure the path matches your prefix logic
rpcRouter.all("/rpc/*", async (c) => {
	// 1. Extract dependencies from Hono context
	const auth = c.get("AUTH");
	const tracer: ITracer = c.get("TRACER");
	const logger = c.get("LOGGER");
	const analytics = c.get("ANALYTICS");
	const database = c.get("DATABASE");

	// 2. Build the Initial Context
	// This matches the 'ORPCContext' base type used in your os.$context<ORPCContext>()
	const orpcContext: BaseContext = {
		headers: c.req.raw.headers,
		auth,
		tracer,
		logger,
		analytics,
		database,
	};

	return await tracer.withSpan<Response | undefined>(
		"rpc.handler",
		async (span) => {
			try {
				// 3. Handle the request
				// orpcHandler should be an instance created via createORPCHandler or similar adapter
				const response = await orpcHandler.handle(c.req.raw, {
					prefix: "/rpc",
					context: orpcContext, // Use 'context', not 'orpcContext' (check your adapter version)
				});

				// 4. Update span and return the raw Response object to Hono
				span.setAttribute("http.status_code", response.response?.status || 500);

				return response.response;
			} catch (error) {
				// Handle specific errors for tracing
				if (error instanceof AuthError) {
					span.recordException(error);
					span.setStatus({
						code: 2, // SpanStatusCode.ERROR
						message: error.message,
					});
				}

				// If it's not handled by the oRPC internal error logic,
				// Hono will catch it or you can format it here.
				throw error;
			}
		}
	);
});
