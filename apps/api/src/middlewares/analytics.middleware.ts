import { getAnalyticsClient } from "@zero-heads-lab/analytics/server";
import type { MiddlewareHandler } from "hono";
import type { Bindings, Variables } from "../types";

export const analyticsMiddleware: MiddlewareHandler<{
    Bindings: Bindings;
    Variables: Variables;
}> = async (c, next) => {
    const analytics = await getAnalyticsClient(
        c.env.CACHE_STORE,
        c.env.POSTHOG_PROJECT_API_KEY
    );

    c.set("analytics", analytics);

    await next();

    c.executionCtx.waitUntil(analytics.shutdown());
};
