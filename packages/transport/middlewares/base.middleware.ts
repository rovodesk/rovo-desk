import { ORPCError } from "@orpc/server";
import { createDatabase } from "@zero-heads-lab/database";
import { base } from "../context";

export const BaseMiddleware = base.middleware(({ context, next }) => {
	const headers = context.reqHeaders;
	if (!headers) {
		throw new ORPCError("BAD_REQUEST", {
			message: "No headers provided",
		});
	}

	const database = createDatabase();
	context.database = database;
	return next({
		context: {
			database,
		},
	});
});
