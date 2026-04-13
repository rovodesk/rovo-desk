import { ORPCError } from "@orpc/server";
import { type OrganizationContext, RPCContext } from "@/lib/context";

export const OrganizationGuard = RPCContext.middleware(({ context, next }) => {
	const session = context.session;
	if (!session) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "No session",
		});
	}

	const organizationId = session.activeOrganizationId;
	if (!organizationId) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "No active organization",
		});
	}

	return next({
		context: {
			...context,
			organizationId,
		} as OrganizationContext,
	});
});
