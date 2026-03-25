import { determineAuthRoles } from "@zero-heads-lab/auth/helpers";
import { createAuth } from "@zero-heads-lab/auth/server";
import type { MiddlewareHandler } from "hono";
import type { Bindings, Variables } from "../types";
// middleware/auth-middleware.ts
export const authMiddleware = (): MiddlewareHandler<{
	Bindings: Bindings;
	Variables: Variables;
}> => {
	return async (c, next) => {
		const logger = c.get("Logger");
		const tracer = c.get("Tracer");
		const analytics = c.get("Analytics");

		// 1. Trace the session lookup
		const session = await tracer.withSpan("auth.get_session", async (span) => {
			const auth = await createAuth(
				c.env.CACHE_STORE,
				analytics,
				logger.derive({ component: "better-auth" })
			);

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
			logger.warn(false, "Unauthorized access attempt", { path: c.req.path });
			return c.json({ message: "Unauthorized" }, 401);
		}

		// 3. Inject for Route Handlers
		c.set("User", session.user);
		c.set("Session", session.session);

		await next();
	};
};
