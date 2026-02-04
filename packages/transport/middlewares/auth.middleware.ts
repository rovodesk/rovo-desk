import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const authMiddleware = base.middleware(async ({ context, next }) => {
	if (!context.auth) {
		// This should NEVER happen if wired correctly
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Auth not initialized",
		});
	}

	const headers = context.reqHeaders;
	if (!headers) {
		throw new ORPCError("UNAUTHORIZED");
	}

	const sessionData = await context.auth.api.getSession({ headers });

	if (!(sessionData?.session && sessionData?.user)) {
		throw new ORPCError("UNAUTHORIZED");
	}

	return next({
		context: {
			session: sessionData.session,
			user: sessionData.user,
		},
	});
});
