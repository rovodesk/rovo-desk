import { ORPCError } from "@orpc/server";
import { RPCContext } from "@/lib/context";

export const AdminGuard = RPCContext.middleware(({ context, next }) => {
	const role = context.role;
	if (role !== "admin") {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Not an admin",
		});
	}

	return next();
});
