import { ORPCError } from "@orpc/server";
import { base } from "../context";

export const OrganizationGuard = base.middleware(({ context, next }) => {
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
			organizationId,
		},
	});
});
