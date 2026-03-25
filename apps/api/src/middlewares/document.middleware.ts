import { createAuth } from "@zero-heads-lab/auth/server";
import type { MiddlewareHandler } from "hono";
import { partyserverMiddleware } from "hono-party";
import type { Bindings, Variables } from "../types";
// middleware/document-middleware.ts
export const documentMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
	Variables: Variables;
	// biome-ignore lint/suspicious/useAwait: no await needed
}> = async (c, _next) => {
	const analytics = c.get("Analytics");
	const logger = c.get("Logger");
	const tracer = c.get("Tracer"); // Ensure you're getting the tracer

	const handler = partyserverMiddleware({
		options: {
			onBeforeConnect: async (req) => {
				// Wrap the WebSocket Handshake Auth in a sub-span
				return await tracer.withSpan(
					"partykit.onBeforeConnect",
					async (span) => {
						const auth = await createAuth(
							c.env.CACHE_STORE,
							analytics,
							logger.derive({ component: "party-auth" })
						);

						const res = await auth.api.getSession({
							headers: req.headers,
						});

						if (!res?.session) {
							logger.warn(true, "partykit.auth.failed", {
								url: req.url,
								ip: req.headers.get("cf-connecting-ip"),
							});
							return new Response("Unauthorized", { status: 401 });
						}

						span.setAttribute("user.id", res.user.id);
						logger.info("partykit.connection.authorized", {
							userId: res.user.id,
						});

						// Proceed with connection
						return undefined;
					}
				);
			},
		},
		onError(error) {
			logger.error("partykit.error", error);
		},
	});

	return handler(c, _next);
};
