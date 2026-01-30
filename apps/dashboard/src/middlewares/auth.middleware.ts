import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createAuth } from "@zero-heads-lab/auth/server";

const publicRoutes = ["/sign-in", "/sign-up", "/api/auth/"];

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const headers = getRequestHeaders();
		const auth = createAuth();
		const session = await auth.api.getSession({ headers });

		// Prepare parsed path for conditional routing
		const url = new URL(request.url);
		const path = url.pathname;

		if (!session) {
			// Special-case: allow OAuth/API auth callback routes to complete without forcing a redirect to sign-in.
			// If the request targets the API auth endpoints (eg. /api/auth/$), let the request pass through
			// to the API handler so OAuth flows can finish and establish a session.
			if (publicRoutes.some((route) => path.startsWith(route))) {
				return next({});
			}
			// For HTML requests, redirect to sign-in
			const acceptsHtml = (request.headers.get("accept") ?? "").includes(
				"text/html"
			);
			if (acceptsHtml) {
				throw redirect({
					to: "/sign-in",
					search: { redirect: request.url },
				});
			}

			// For API requests, return 401
			return new Response("Unauthorized", { status: 401 });
		}

		return next({
			context: {
				auth: {
					session: session?.session,
					user: session?.user,
				},
			},
		});
	}
);

export default authMiddleware;
