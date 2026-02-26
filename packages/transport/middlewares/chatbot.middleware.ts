import { ORPCError } from "@orpc/server";
import { getSDKByOrganizationId } from "@zero-heads-lab/database/repositories/sdk/queries";
import { base } from "../context";

export const ChatbotGuard = base.middleware(async ({ context, next }) => {
	const database = context.database;
	if (!database) {
		throw new ORPCError("INTERNAL_SERVER_ERROR", {
			message: "Database not initialized",
		});
	}

	const organizationId = context.organizationId;
	if (!organizationId) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "No active organization",
		});
	}

	const chatbot = await getSDKByOrganizationId(database, {
		organizationId,
	});
	if (!chatbot) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "No active chatbot",
		});
	}

	return next({
		context: {
			chatbotId: chatbot.id,
		},
	});
});
