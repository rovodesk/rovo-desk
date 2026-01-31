import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createAuth } from "@zero-heads-lab/auth/server";

const publicRoutes = ["/sign-in", "/sign-up", "/api/auth/"];

// Initialize auth as a singleton (ensure your createAuth handles internal caching)
const auth = createAuth();

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const headers = getRequestHeaders();
		const url = new URL(request.url);
		const path = url.pathname;

		// 1. Fetch Session
		const session = await auth.api.getSession({ headers });

		// 2. Define Authentication Validity
		const isExpired = session && session.session.expiresAt < new Date();
		const isUnverified = session && !session.user.emailVerified;
		const isInvalidUser =
			session &&
			(isUnverified || session.user.isAnonymous || session.user.deletedAt);

		const unAuthenticated = !session || isExpired || isInvalidUser;

		// 3. Handle Public Access
		if (unAuthenticated) {
			const isPublicPath = publicRoutes.some((route) => path.startsWith(route));

			if (isPublicPath) return next({});

			const acceptsHtml = (request.headers.get("accept") ?? "").includes(
				"text/html"
			);
			if (acceptsHtml) {
				throw redirect({
					to: "/sign-in",
					search: {
						redirect: request.url,
						verified: isUnverified ? "true" : null,
					},
				});
			}
			return new Response("Unauthorized", { status: 401 });
		}

		// 5. Pass clean context to downstream loaders/actions
		return next({
			context: {
				auth: {
					session: session.session,
					user: session.user,
				},
			},
		});
	}
);

export default authMiddleware;
