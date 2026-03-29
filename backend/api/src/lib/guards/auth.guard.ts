import { ORPCError } from "@orpc/server";
import { type AuthenticatedContext, RPCContext } from "@/lib/context";

export const AuthGuard = RPCContext.middleware(async ({ context, next }) => {
	const { auth, headers } = context;

	if (!auth) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Auth not initialized",
		});
	}

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
			...context,
			auth,
			session: sessionData.session,
			user: sessionData.user,
			role: sessionData.user.role,
		} as AuthenticatedContext,
	});
});
