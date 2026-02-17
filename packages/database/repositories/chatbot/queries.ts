import { eq, type InferSelectModel } from "drizzle-orm";
import { createDatabase } from "../../conn";
import {
	type botSettings,
	chatbot,
} from "../../drizzle/schemas/chatbot.schema";

export type Chatbot = Omit<InferSelectModel<typeof chatbot>, "chatbotId">;

export type Settings = InferSelectModel<typeof botSettings>;

export type ChatbotWithSettings = Chatbot & {
	settings: Settings | null;
};

export async function getChatbotByOrganizationId(
	organizationId: string
): Promise<Chatbot> {
	const db = createDatabase();
	const bot = await db.query.chatbot.findFirst({
		where: eq(chatbot.organizationId, organizationId),
	});

	if (!bot) {
		throw new Error("Chatbot not found");
	}

	return bot;
}

export async function getChatbotWithSettingsByOrganizationId(
	organizationId: string
): Promise<ChatbotWithSettings> {
	const db = createDatabase();
	const bot = await db.query.chatbot.findFirst({
		where: eq(chatbot.organizationId, organizationId),
		with: {
			settings: true,
		},
	});

	if (!bot) {
		throw new Error("Chatbot not found");
	}

	return bot;
}
