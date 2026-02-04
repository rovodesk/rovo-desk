// middleware/auth.middleware.ts
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import {
	hasPlatformAccessRole,
	validateSession,
} from "@zero-heads-lab/auth/helpers";
import { createAuth } from "@zero-heads-lab/auth/server";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/api/auth/"] as const;
const ADMIN_ROUTES = ["/admin"] as const;

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────

/**
 * Check if a path matches any route prefix
 */
function matchesRoute(path: string, routes: readonly string[]): boolean {
	return routes.some((route) => path.startsWith(route));
}

/**
 * Check if request expects HTML response
 */
function acceptsHtml(request: Request): boolean {
	return (request.headers.get("accept") ?? "").includes("text/html");
}

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const auth = createAuth();
		const headers = getRequestHeaders();
		const url = new URL(request.url);
		const path = url.pathname;

		// 1. Fetch session
		const sessionResult = await auth.api.getSession({ headers });
		const validation = validateSession(sessionResult);

		// 2. Handle invalid/missing session
		if (!validation.valid) {
			// Allow public routes regardless of session state
			if (matchesRoute(path, PUBLIC_ROUTES)) {
				return next({});
			}

			// Redirect to sign-in with reason
			if (acceptsHtml(request)) {
				throw redirect({
					to: "/sign-in",
					search: {
						redirectReason:
							validation.reason === "unverified" ? "false" : undefined,
					},
				});
			}

			// API response
			return new Response("Unauthorized", {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 3. Session is valid — extract it
		const { session } = validation;

		// 4. Check admin routes
		if (matchesRoute(path, ADMIN_ROUTES) && !hasPlatformAccessRole(session)) {
			if (acceptsHtml(request)) {
				throw redirect({
					to: "/403",
					search: {
						error: "forbidden",
					},
				});
			}

			return new Response("Forbidden", {
				status: 403,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 5. Pass validated session to downstream
		return next({
			context: {
				session,
			},
		});
	}
);

export default authMiddleware;
