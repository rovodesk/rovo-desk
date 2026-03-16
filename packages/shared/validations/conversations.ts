import { z } from "zod";

export const ConversationStatusSchema = z.enum([
	"open",
	"closed",
	"snoozed",
	"pending",
]);

export const ConversationChannelSchema = z.enum([
	"chat",
	"email",
	"social",
	"sms",
	"whatsapp",
]);

export const ConversationPrioritySchema = z.enum([
	"low",
	"normal",
	"high",
	"urgent",
]);

export const MessageTypeSchema = z.enum([
	"text",
	"attachment",
	"system",
	"event",
]);

export const ParticipantSchema = z.object({
	id: z.string(),

	name: z.string(),

	email: z.email().optional(),

	avatar: z.url().optional(),

	initials: z.string().max(4).optional(),

	avatarColor: z.string().optional(),

	role: z.enum(["customer", "agent", "bot", "system"]),

	joinedAt: z.string().datetime().optional(),
});

export const AttachmentSchema = z.object({
	id: z.string(),

	name: z.string(),

	url: z.string().url(),

	mimeType: z.string(),

	size: z.number(),
});

export const ReactionSchema = z.object({
	emoji: z.string(),

	userIds: z.array(z.string()),
});

export const MessageSenderSchema = z.object({
	id: z.string(),
	role: z.enum(["customer", "agent", "bot", "system"]),
	name: z.string(),
	avatar: z.string().url().optional(),
	email: z.string().email().optional(),
	initials: z.string().max(4).optional(),
	avatarColor: z.string().optional(),
});

export const MessageSchema = z.object({
	id: z.string(),
	type: MessageTypeSchema,
	sender: MessageSenderSchema,
	text: z.string().optional(),
	attachments: z.array(AttachmentSchema).optional(),
	reactions: z.array(ReactionSchema).optional(),
	edited: z.boolean().default(false),
	deleted: z.boolean().default(false),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime().optional(),
});

export const ConversationSchema = z.object({
	id: z.string(),

	subject: z.string().optional(),

	channel: ConversationChannelSchema,

	status: ConversationStatusSchema,

	priority: ConversationPrioritySchema.default("normal"),

	starred: z.boolean().default(false),

	archived: z.boolean().default(false),

	snoozedUntil: z.string().datetime().nullable().optional(),

	createdAt: z.string().datetime(),

	updatedAt: z.string().datetime(),

	lastMessageAt: z.string().datetime().optional(),

	unreadCount: z.number().default(0),

	tags: z.array(z.string()).optional(),

	assigneeId: z.string().optional(),

	participants: z.array(ParticipantSchema),

	messages: z.array(MessageSchema),
});

export const ConversationItemSchema = z.object({
	id: z.string(),

	name: z.string(),

	email: z.string().email().optional(),

	subject: z.string().optional(),

	preview: z.string(),

	time: z.string(),

	channel: ConversationChannelSchema,

	status: ConversationStatusSchema,

	starred: z.boolean(),

	initials: z.string().optional(),

	avatar: z.url().optional(),

	avatarColor: z.string().optional(),

	unreadCount: z.number(),

	priority: ConversationPrioritySchema.optional(),

	tags: z.array(z.string()).optional(),
});

export const ConversationsSchema = z.array(ConversationSchema);

export const ConversationItemsSchema = z.array(ConversationItemSchema);
