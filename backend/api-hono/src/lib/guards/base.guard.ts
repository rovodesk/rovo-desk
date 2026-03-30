import { ORPCError } from "@orpc/server";
import { type BaseContext, RPCContext } from "@/lib/context";

export const BaseGuard = RPCContext.middleware(({ context, next }) => {
	const { headers, database, analytics, tracer, logger } = context;

	if (!headers) {
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
			...context,
			headers,
			database,
			analytics,
			logger,
			tracer,
		} as BaseContext,
	});
});
