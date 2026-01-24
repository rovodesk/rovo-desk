import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getToken } from "@/lib/auth/server";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const token = await getToken();

		if (!token) {
			const acceptsHtml = (request.headers.get("accept") ?? "").includes(
				"text/html"
			);

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
