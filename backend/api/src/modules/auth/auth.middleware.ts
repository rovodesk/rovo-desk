import type { ILogger, ITracer } from "@zero-heads-lab/analytics/types";
import { determineAuthRoles } from "@zero-heads-lab/auth/helpers";
import type { AuthInstance } from "@zero-heads-lab/auth/types";
import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "@/lib/context";

export const authMiddleware = (): MiddlewareHandler<AppEnv> => {
	return async (c, next) => {
		const auth: AuthInstance = c.get("AUTH");
		const tracer: ITracer = c.get("TRACER");
		const logger: ILogger = c.get("LOGGER");

		// 1. Trace the session lookup
		const session = await tracer.withSpan("auth.get_session", async (span) => {
			const sessionData = await auth.api.getSession({
				headers: c.req.raw.headers,
			});

			if (sessionData?.session && sessionData?.user) {
				// Enrich the request-scoped logger with User identity
				logger.setAuthContext({
					userId: sessionData.user.id,
					sessionId: sessionData.session.id,
					role: determineAuthRoles(sessionData.user.role),
				});

				span.setAttribute("user.id", sessionData.user.id);
				span.setAttribute("user.role", sessionData.user.role);
			}
			return sessionData;
		});

		// 2. Guard the route
		if (!(session?.session && session?.user)) {
			logger.warn(false, "Unauthorized access attempt", {
				path: c.req.path,
			});
			return c.json({ message: "Unauthorized" }, 401);
		}

		// 3. Inject for Route Handlers
		c.set("USER", session.user);
		c.set("SESSION", session.session);

		await next();
	};
};
