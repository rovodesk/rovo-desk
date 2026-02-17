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
