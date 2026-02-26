import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const AuthGuard = base.middleware(async ({ context, next }) => {
	const auth = context.auth;
	if (!auth) {
		// This should NEVER happen if wired correctly
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Auth not initialized",
		});
	}

	const headers = context.reqHeaders;
	if (!headers) {
		throw new ORPCError("BAD_REQUEST", {
			message: "No headers provided",
		});
	}

	const sessionData = await auth.api.getSession({ headers });

	if (!(sessionData?.session && sessionData?.user)) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "No session or user found",
		});
	}

	return next({
		context: {
			auth,
			session: sessionData.session,
			user: sessionData.user,
		},
	});
});
