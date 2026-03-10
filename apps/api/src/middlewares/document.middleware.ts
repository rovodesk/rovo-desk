import { createAuth } from "@zero-heads-lab/auth/server";
import type { MiddlewareHandler } from "hono";
import { partyserverMiddleware } from "hono-party";
import type { Bindings } from "../types";

export const documenttMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
	// biome-ignore lint/suspicious/useAwait: No Awaited Funcrion
}> = async (c, _next) => {
	const auth = createAuth(c.env.AUTH_CACHE);

	const handler = partyserverMiddleware({
		options: {
			onBeforeConnect: async (req) => {
				const res = await auth.api.getSession({
					headers: req.headers,
				});
				// Validate Session
				if (!res?.session) return new Response("Unauthorized", { status: 401 });
			},
			// cors: {
			// 	"Access-Control-Allow-Origin": getAllowedOrigins(c).join(", "),
			// 	"Access-Control-Allow-Credentials": "true",
			// 	"Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
			// 	"Access-Control-Allow-Headers": "Content-Type, Authorization",
			// },
		},
		onError(error) {
			console.error("PARTYKIT ERROR", error);
		},
	});

	return handler(c, _next);
};
