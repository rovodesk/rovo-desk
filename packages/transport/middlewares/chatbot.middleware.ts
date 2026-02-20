import { ORPCError } from "@orpc/server";
import { getChatbotByOrganizationId } from "@zero-heads-lab/database/repositories/chatbot/queries";
import { base } from "../context";

export const ChatbotGuard = base.middleware(async ({ context, next }) => {
	const organizationId = context.organizationId;
	if (!organizationId) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "No active organization",
		});
	}

	const chatbot = await getChatbotByOrganizationId(organizationId);
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
