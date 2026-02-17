import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const BaseMiddleware = base.middleware(({ context, next }) => {
	const headers = context.reqHeaders;
	if (!headers) {
		throw new ORPCError("BAD_REQUEST", {
			message: "No headers provided",
		});
	}

	return next();
});
