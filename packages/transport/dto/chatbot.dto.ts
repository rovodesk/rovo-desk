import z from "zod";

export const CHATBOT_DTO = z.object({
	id: z.string(),
	organizationId: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date().nullable(),
	deletedAt: z.date().nullable().optional(),
});

export const UPDATE_CHATBOT_SETTINGS_INPUT_DTO = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required").optional(),
	instruction: z.string().nullable().optional(),
	welcomeMessage: z.string().nullable().optional(),
	inputPlaceholder: z.string().nullable().optional(),
	primaryColor: z.string().nullable().optional(),
	secondaryColor: z.string().nullable().optional(),
	model: z.string().nullable().optional(),
	temperature: z.number().nullable().optional(),
	metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const BOT_SETTINGS_DTO = z.object({
	chatbotId: z.string(),
	instruction: z.string().nullable().optional(),
	welcomeMessage: z.string().nullable().optional(),
	inputPlaceholder: z.string().nullable().optional(),
	primaryColor: z.string().nullable().optional(),
	secondaryColor: z.string().nullable().optional(),
	model: z.string(),
	temperature: z.number().nullable().optional(),
	metadata: z.record(z.string(), z.unknown()).nullable().optional(),
	updatedAt: z.date().nullable().optional(),
});

export const CREATE_CHATBOT_INPUT_DTO = z.object({
	organizationId: z.string(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

export const CHATBOT_WITH_SETTINGS_DTO = CHATBOT_DTO.extend({
	settings: BOT_SETTINGS_DTO.nullable().optional(),
});

export const CREATE_CHATBOT_CONNECTION_INPUT_DTO = z.object({
	connectionIcon: z.string(),
	connectionName: z.string().min(1, "Connection name is required"),
	connectionSource: z.string().min(1, "Connection source is required"),
	connectionType: z.enum(["CLIENT", "SERVER"]),
});

export const CREATE_CHATBOT_CONNECTION_OUTPUT_DTO = z.object({
	key: z.string().nullable(),
});

export const CHATBOT_CONNECTION_DTO = z.object({
	id: z.string(),
	connectionName: z.string(),
	connectionIcon: z.string(),
	connectionSource: z.string(),
	connectionType: z.enum(["CLIENT", "SERVER"]),
	keys: z
		.object({
			publicKey: z.string(),
			privateKey: z.string(),
			status: z.enum(["active", "rotating", "expired"]),
			expiryDate: z.date().nullable().optional(),
		})
		.nullable()
		.optional(),
	isActive: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date().nullable(),
	deletedAt: z.coerce.date().nullable().optional(),
});

export const CHATBOT_CONNECTIONS_DTO = z.array(CHATBOT_CONNECTION_DTO);

export const FIND_CHATBOT_CONNECTION_INPUT_DTO = z.object({
	connectionId: z.string(),
});

export const DELETE_CHATBOT_CONNECTION_INPUT_DTO = z.object({
	connectionId: z.string(),
});

export const TOGGLE_CHATBOT_CONNECTION_INPUT_DTO = z.object({
	connectionId: z.string(),
});

export const ROTATE_CHATBOT_CONNECTION_KEYS_INPUT_DTO = z.object({
	connectionId: z.string(),
	connectionType: z.enum(["CLIENT", "SERVER"]),
});

export const ROTATE_CHATBOT_CONNECTION_KEYS_OUTPUT_DTO = z.object({
	publicKey: z.string().nullable().optional(),
	privateKey: z.string().nullable().optional(),
});

export const UPDATE_CHATBOT_CONNECTION_INPUT_DTO = z.object({
	connectionId: z.string(),
	connectionName: z.string().min(1, "Connection name is required").optional(),
	connectionSource: z
		.string()
		.min(1, "Connection source is required")
		.optional(),
});

export const CONVERSATION_DTO = z.object({
	id: z.string(),
	chatbotId: z.string(),
	organizationId: z.string(),
	userId: z.string().nullable().optional(),
	externalUserId: z.string().nullable().optional(),
	status: z.string(),
	totalTokens: z.number().nullable().optional(),
	createdAt: z.date(),
	endedAt: z.date().nullable().optional(),
	deletedAt: z.date().nullable().optional(),
});

export const MESSAGE_DTO = z.object({
	id: z.string(),
	conversationId: z.string(),
	role: z.string(),
	content: z.string(),
	tokenCount: z.number().nullable().optional(),
	model: z.string().nullable().optional(),
	attachments: z.record(z.string(), z.unknown()).nullable().optional(),
	metadata: z.record(z.string(), z.unknown()).nullable().optional(),
	createdAt: z.date(),
	deletedAt: z.date().nullable().optional(),
});

export const USAGE_EVENT_DTO = z.object({
	id: z.string(),
	organizationId: z.string(),
	chatbotId: z.string().nullable().optional(),
	tokens: z.number(),
	cost: z.string().nullable().optional(), // numeric is often returned as string in pg
	createdAt: z.date(),
	deletedAt: z.date().nullable().optional(),
});
