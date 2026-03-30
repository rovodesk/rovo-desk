import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { AuthInstance } from "@zero-heads-lab/auth/types";
import { Hono } from "hono";
import type { AppEnv } from "@/lib/context";
import { AuthError } from "@/lib/errors/auth.error";

export const authRouter = new Hono<AppEnv>();

authRouter.on(["POST", "GET"], "/auth/:path{.*}", async (c) => {
	const auth: AuthInstance = c.get("AUTH");
	const tracer: ITracer = c.get("TRACER");

	const path = c.req.param("path");

	return await tracer.withSpan(
		"auth.handler",
		async (span) => {
			try {
				const response = await auth.handler(c.req.raw);
				span.setAttribute("http.status_code", response.status);
				return response;
			} catch (error) {
				if (error instanceof AuthError) {
					span.recordException(error);
					span.setStatus({
						code: error.code,
						message: error.message,
					});
					throw error;
				}

				throw error;
			}
		},
		{
			"http.method": c.req.method,
			"http.path": path,
		}
	);
});
