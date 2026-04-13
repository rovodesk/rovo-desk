import type { MiddlewareHandler } from "hono";
import { partyserverMiddleware } from "hono-party";
import type { AppEnv } from "../../lib/context";

export const documentMiddleware: MiddlewareHandler<AppEnv> = (c, _next) => {
	const logger = c.get("LOGGER");
	const tracer = c.get("TRACER");
	const auth = c.get("AUTH");

	const handler = partyserverMiddleware({
		options: {
			onBeforeConnect: async (req) => {
				// Wrap the WebSocket Handshake Auth in a sub-span
				return await tracer.withSpan(
					"partykit.onBeforeConnect",
					async (span) => {
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
