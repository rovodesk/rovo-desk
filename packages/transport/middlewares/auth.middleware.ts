import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const AuthGuard = base.middleware(async ({ context, next }) => {
	const { auth, reqHeaders } = context;
	if (!auth) {
		// This should NEVER happen if wired correctly
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Auth not initialized",
		});
	}

	if (!reqHeaders) {
		throw new ORPCError("BAD_REQUEST", {
			message: "No headers provided",
		});
	}

	const sessionData = await auth.api.getSession({ headers: reqHeaders });

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
