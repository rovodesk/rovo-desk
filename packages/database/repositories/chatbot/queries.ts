import { desc, eq, type InferSelectModel } from "drizzle-orm";
import { createDatabase } from "../../conn";
import {
	chatbot,
	chatbotConnections,
	type chatbotSettings,
} from "../../drizzle/schemas/chatbot.schema";

export type Chatbot = Omit<InferSelectModel<typeof chatbot>, "chatbotId">;

export type Settings = InferSelectModel<typeof chatbotSettings>;

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

export async function getChatbotConnectionById(connectionId: string) {
	const db = createDatabase();
	return await db.query.chatbotConnections.findFirst({
		where: eq(chatbotConnections.id, connectionId),
	});
}

export async function listChatbotConnections(chatbotId: string) {
	const db = createDatabase();
	return await db
		.select()
		.from(chatbotConnections)
		.where(eq(chatbotConnections.chatbotId, chatbotId))
		.orderBy(desc(chatbotConnections.createdAt));
}

export async function getChatbotConnectionPrivateKey(connectionId: string) {
	const db = createDatabase();
	return await db
		.select({
			privateKey: chatbotConnections.privateKey,
		})
		.from(chatbotConnections)
		.where(eq(chatbotConnections.id, connectionId))
		.then((res) => res[0]);
}

export async function getChatbotConnectionPublicKey(connectionId: string) {
	const db = createDatabase();
	return await db
		.select({
			publicKey: chatbotConnections.publicKey,
		})
		.from(chatbotConnections)
		.where(eq(chatbotConnections.id, connectionId))
		.then((res) => res[0]);
}
