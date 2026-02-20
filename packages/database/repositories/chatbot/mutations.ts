import { randomUUID } from "crypto";
import type { InferInsertModel } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import { createDatabase } from "../../conn";
import { organization } from "../../drizzle/schemas/auth.schema";
import {
	chatbot,
	chatbotConnections,
	chatbotSettings,
	usageEvents,
} from "../../drizzle/schemas/chatbot.schema";

type CreateChatbotInput = {
	organizationId: string;
	name: string;
	description?: string;
};

export type UpdateBotSettingsInput = Partial<
	Omit<InferInsertModel<typeof chatbotSettings>, "chatbotId" | "updatedAt">
>;

export async function createChatbotWithDefaultsTransaction(
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
		await tx.insert(chatbotSettings).values({
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

export async function updateChatbotSettingsTransaction(params: {
	organizationId: string;
	chatbotId: string;
	name?: string;
	data: UpdateBotSettingsInput;
}) {
	const db = createDatabase();
	const { organizationId, chatbotId, data, name } = params;

	return await db.transaction(async (tx) => {
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
			.insert(chatbotSettings)
			.values({
				chatbotId,
				...data,
			})
			.onConflictDoUpdate({
				target: chatbotSettings.chatbotId,
				set: {
					...data,
					updatedAt: new Date(),
				},
			})
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to update chatbot settings");
			});
	});
}

export async function updateChatbotConnectionTransaction(params: {
	connectionId: string;
	connectionName?: string;
	connectionSource?: string;
}) {
	const db = createDatabase();
	const { connectionId, connectionName, connectionSource } = params;

	return await db.transaction(async (tx) => {
		const existingConnection = await tx.query.chatbotConnections.findFirst({
			where: eq(chatbotConnections.id, connectionId),
			columns: { id: true },
		});

		if (!existingConnection) {
			throw new Error("Chatbot connection not found or access denied");
		}

		await tx
			.update(chatbotConnections)
			.set({
				connectionName,
				connectionSource,
				updatedAt: new Date(),
			})
			.where(eq(chatbotConnections.id, connectionId))
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to update chatbot connection");
			});
	});
}

export async function createChatbotConnectionTransaction(
	chatbotId: string,
	connectionName: string,
	connectionType: string,
	connectionSource: string,
	connectionIcon: string,
	privateKey: string,
	publicKey: string
) {
	const db = createDatabase();
	return await db.transaction(async (tx) => {
		const existingChatbot = await tx.query.chatbot.findFirst({
			where: eq(chatbot.id, chatbotId),
			columns: { id: true },
		});

		if (!existingChatbot) {
			throw new Error("Chatbot not found or access denied");
		}

		await tx
			.insert(chatbotConnections)
			.values({
				chatbotId: existingChatbot.id,
				connectionType,
				connectionName,
				connectionIcon,
				privateKey,
				publicKey,
				connectionSource,
			})
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to create chatbot connection");
			});
	});
}

export async function softDeleteChatbotConnection(connectionId: string) {
	const db = createDatabase();
	return await db
		.update(chatbotConnections)
		.set({
			isActive: false,
			updatedAt: new Date(),
			deletedAt: new Date(),
		})
		.where(eq(chatbotConnections.id, connectionId))
		.catch((error) => {
			console.error(error);
			throw new Error("Failed to delete chatbot connection");
		});
}

export async function deleteChatbot(chatbotId: string) {
	const db = createDatabase();
	return await db.transaction(async (tx) => {
		const existingChatbot = await tx.query.chatbot.findFirst({
			where: and(eq(chatbot.id, chatbotId)),
			columns: { id: true },
		});

		if (!existingChatbot) {
			throw new Error("Chatbot not found or access denied");
		}

		await tx
			.update(chatbot)
			.set({
				deletedAt: new Date(),
			})
			.where(eq(chatbot.id, chatbotId))
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to delete chatbot");
			});
	});
}

export async function rotateChatbotConnectionKeysTransaction(
	connectionId: string,
	newKeys: {
		privateKey: string;
		publicKey: string;
	}
) {
	const db = createDatabase();
	return await db.transaction(async (tx) => {
		const existingConnection = await tx.query.chatbotConnections.findFirst({
			where: eq(chatbotConnections.id, connectionId),
			columns: { id: true },
		});

		if (!existingConnection) {
			throw new Error("Chatbot connection not found or access denied");
		}

		await tx
			.update(chatbotConnections)
			.set({
				privateKey: newKeys.privateKey,
				publicKey: newKeys.publicKey,
				updatedAt: new Date(),
			})
			.where(eq(chatbotConnections.id, connectionId))
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to rotate chatbot connection keys");
			});
	});
}

export async function toggleConnectionTransaction(params: {
	connectionId: string;
}) {
	const db = createDatabase();
	return await db.transaction(async (tx) => {
		const existingConnection = await tx.query.chatbotConnections.findFirst({
			where: eq(chatbotConnections.id, params.connectionId),
			columns: { id: true, isActive: true },
		});

		if (!existingConnection) {
			throw new Error("Chatbot connection not found or access denied");
		}

		await tx
			.update(chatbotConnections)
			.set({
				isActive: !existingConnection.isActive,
			})
			.where(eq(chatbotConnections.id, params.connectionId))
			.catch((error) => {
				console.error(error);
				throw new Error("Failed to deactivate chatbot connection");
			});
	});
}
