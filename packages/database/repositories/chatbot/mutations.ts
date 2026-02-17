import { randomUUID } from "crypto";
import type { InferInsertModel } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import { organization } from "../../drizzle/schemas/auth.schema";
import {
	botSettings,
	chatbot,
	usageEvents,
} from "../../drizzle/schemas/chatbot.schema";

type CreateChatbotInput = {
	organizationId: string;
	name: string;
	description?: string;
};

export type UpdateBotSettingsInput = Partial<
	Omit<InferInsertModel<typeof botSettings>, "chatbotId" | "updatedAt">
>;

export async function createChatbotWithDefaults(
	input: CreateChatbotInput
): Promise<void> {
	const db = createDatabase();

	return await db.transaction(async (tx) => {
		// Ensure organization exists (safety guard)
		const org = await tx.query.organization.findFirst({
			where: eq(organization.id, input.organizationId),
		});

		if (!org) {
			throw new Error("Organization not found");
		}

		// Create chatbot
		const chatbotId = randomUUID();

		await tx.insert(chatbot).values({
			id: chatbotId,
			organizationId: input.organizationId,
			name: input.name,
			description: input.description ?? null,
		});

		// Create default settings (1:1)
		await tx.insert(botSettings).values({
			chatbotId,
			instruction: "You are a helpful AI assistant.",
			welcomeMessage: "Hi 👋 How can I help you today?",
			inputPlaceholder: "Type your message...",
			primaryColor: "#000000",
			secondaryColor: "#ffffff",
			model: "gpt-4o-mini",
			temperature: 0.7,
		});

		// Add Default Usage Row
		await tx.insert(usageEvents).values({
			organizationId: input.organizationId,
			chatbotId,
			tokens: 0,
		});

		// Return fully hydrated chatbot
		// const created = await tx
		// 	.select()
		// 	.from(chatbot)
		// 	.where(eq(chatbot.id, chatbotId))
		// 	.limit(1);

		return;
	});
}

/**
 * Update chatbot settings in a transaction.
 * - Verifies chatbot belongs to organization
 * - Upserts settings
 */
export function updateChatbotSettingsTransaction(params: {
	organizationId: string;
	chatbotId: string;
	name?: string;
	data: UpdateBotSettingsInput;
}) {
	const db = createDatabase();
	const { organizationId, chatbotId, data, name } = params;

	return db.transaction(async (tx) => {
		const existingChatbot = await tx.query.chatbot.findFirst({
			where: and(
				eq(chatbot.id, chatbotId),
				eq(chatbot.organizationId, organizationId)
			),
			columns: { id: true },
		});

		if (!existingChatbot) {
			throw new Error("Chatbot not found or access denied");
		}

		if (name) {
			await tx
				.update(chatbot)
				.set({ name, updatedAt: new Date() })
				.where(eq(chatbot.id, chatbotId));
		}

		await tx
			.insert(botSettings)
			.values({
				chatbotId,
				...data,
			})
			.onConflictDoUpdate({
				target: botSettings.chatbotId,
				set: {
					...data,
					updatedAt: new Date(),
				},
			});

		return await tx.query.botSettings.findFirst({
			where: eq(botSettings.chatbotId, chatbotId),
		});
	});
}
