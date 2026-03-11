import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const BaseMiddleware = base.middleware(({ context, next }) => {
	const headers = context.reqHeaders;
	if (!headers) {
		throw new ORPCError("BAD_REQUEST", {
			message: "No headers provided",
		});
	}
	const database = context.database;
	if (!database) {
		// This should NEVER happen if wired correctly
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Database not initialized",
		});
	}

	const analytics = context.analytics;
	if (!analytics) {
		// This should NEVER happen if wired correctly
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Analytics not initialized",
		});
	}

	return next({
		context: {
			database,
			analytics,
		},
	});
});
