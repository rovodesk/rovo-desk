import { ORPCError } from "@orpc/client";
import { updateChatbotSettingsTransaction } from "@zero-heads-lab/database/repositories/chatbot/mutations";
import { getChatbotWithSettingsByOrganizationId } from "@zero-heads-lab/database/repositories/chatbot/queries";
import { BaseMiddleware } from "@/middlewares/base.middleware";
import { base } from "../context";
import {
	CHATBOT_WITH_SETTINGS_DTO,
	UPDATE_CHATBOT_SETTINGS_INPUT_DTO,
} from "../dto/chatbot.dto";
import { AuthGuard } from "../middlewares/auth.middleware";
import { OrganizationGuard } from "../middlewares/organization.middleware";

export const findChatbotWithSettings = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.output(CHATBOT_WITH_SETTINGS_DTO)
	.handler(async ({ context }) => {
		const organizationId = context.organizationId;

		const chatbot =
			await getChatbotWithSettingsByOrganizationId(organizationId);
		if (!chatbot) {
			throw new ORPCError("NOT_FOUND", {
				message: "Chatbot not found",
			});
		}
		return chatbot;
	})
	.callable();

export const updateChatbotSettings = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.input(UPDATE_CHATBOT_SETTINGS_INPUT_DTO)
	.output(CHATBOT_WITH_SETTINGS_DTO)
	.handler(async ({ context, input }) => {
		const organizationId = context.organizationId;

		await updateChatbotSettingsTransaction({
			organizationId,
			chatbotId: input.id,
			name: input.name,
			data: {
				instruction: input.instruction,
				welcomeMessage: input.welcomeMessage,
				inputPlaceholder: input.inputPlaceholder,
				primaryColor: input.primaryColor,
				secondaryColor: input.secondaryColor,
				model: input.model ?? undefined,
				temperature: input.temperature,
			},
		});

		const chatbot =
			await getChatbotWithSettingsByOrganizationId(organizationId);
		if (!chatbot) {
			throw new ORPCError("NOT_FOUND", {
				message: "Chatbot not found",
			});
		}
		return chatbot;
	})
	.callable();
