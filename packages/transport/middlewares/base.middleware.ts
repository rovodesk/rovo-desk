import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const BaseMiddleware = base.middleware(({ context, next }) => {
	const { reqHeaders, database, analytics, tracer, logger } = context;

	if (!reqHeaders) {
		throw new ORPCError("BAD_REQUEST", {
			message: "No headers provided",
		});
	}
	if (!database) {
		// This should NEVER happen if wired correctly
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Database not initialized",
		});
	}

	if (!analytics) {
		// This should NEVER happen if wired correctly
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Analytics not initialized",
		});
	}

	if (!tracer) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Tracer not initialized",
		});
	}

	if (!logger) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Logger not initialized",
		});
	}

	return next({
		context: {
			database,
			analytics,
		},
	});
});
