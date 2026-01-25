import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getToken } from "@/lib/auth/server";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const token = await getToken();

		// Prepare parsed path for conditional routing
		const url = new URL(request.url);
		const path = url.pathname;

		if (!token) {
			const acceptsHtml = (request.headers.get("accept") ?? "").includes(
				"text/html"
			);

			// Special-case: allow OAuth/API auth callback routes to complete without forcing a redirect to sign-in.
			// If the request targets the API auth endpoints (eg. /api/auth/$), let the request pass through
			// to the API handler so OAuth flows can finish and establish a session.
			if (path.startsWith("/api/auth/")) {
				return next({});
			}

			if (acceptsHtml) {
				throw redirect({
					to: "/sign-in",
					search: { redirect: request.url },
				});
			}

			return new Response("Unauthorized", { status: 401 });
		}

		return next({
			context: {
				auth: {
					token,
				},
			},
		});
	}
);

export default authMiddleware;
