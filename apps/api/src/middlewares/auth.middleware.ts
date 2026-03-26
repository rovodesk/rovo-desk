import { determineAuthRoles } from "@zero-heads-lab/auth/helpers";
import { createAuth } from "@zero-heads-lab/auth/server";
import { createDatabase } from "@zero-heads-lab/database";
import type { MiddlewareHandler } from "hono";
import type { Bindings, Variables } from "../types";
// middleware/auth-middleware.ts
export const authMiddleware = (): MiddlewareHandler<{
	Bindings: Bindings;
	Variables: Variables;
}> => {
	return async (c, next) => {
		const logger = c.get("LOGGER");
		const tracer = c.get("TRACER");
		const analytics = c.get("ANALYTICS");
		const database = c.get("DATABASE");

		const { db } = await createDatabase(c.env.DATABASE_URL, logger);
		// 1. Trace the session lookup
		const session = await tracer.withSpan("auth.get_session", async (span) => {
			const auth = await createAuth(
				c.env.CACHE_STORE,
				database,
				analytics,
				logger.derive({ component: "auth" }),
				tracer
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
		c.set("USER", session.user);
		c.set("SESSION", session.session);

		await next();
	};
};
