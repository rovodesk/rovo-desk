import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const AdminGuard = base.middleware(({ context, next }) => {
	const user = context.user;
	if (!user) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "No session",
		});
	}

	const role = user.role;
	if (role !== "admin") {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Not an admin",
		});
	}

	return next({
		context: {
			role,
		},
	});
});
