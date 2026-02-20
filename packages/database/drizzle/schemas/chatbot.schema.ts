import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	numeric,
	pgSchema,
	real,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";

export const chatbotSchema = pgSchema("chatbot");

export const chatbot = chatbotSchema.table(
	"chatbot",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description"),
		isActive: boolean("isActive").notNull().default(true),
		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(t) => [index("chatbots_org_idx").on(t.organizationId)]
);

export const chatbotRelations = relations(chatbot, ({ one, many }) => ({
	organization: one(organization, {
		fields: [chatbot.organizationId],
		references: [organization.id],
	}),

	settings: one(chatbotSettings, {
		fields: [chatbot.id],
		references: [chatbotSettings.chatbotId],
	}),

	conversations: many(conversations),

	connections: many(chatbotConnections),
}));

export const chatbotSettings = chatbotSchema.table(
	"chatbot_settings",
	{
		chatbotId: text("chatbotId")
			.primaryKey()
			.references(() => chatbot.id, { onDelete: "cascade" }),
		instruction: text("instruction"),
		welcomeMessage: text("welcomeMessage"),
		inputPlaceholder: text("inputPlaceholder"),

		primaryColor: text("primaryColor"),
		secondaryColor: text("secondaryColor"),

		model: text("model").notNull().default("gpt-4o-mini"),
		temperature: real("temperature").default(0.7),

		metadata: jsonb("metadata").$type<Record<string, unknown>>(),

		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [index("bot_settings_chatbot_idx").on(t.chatbotId)]
);

export const chatbotSettingsRelations = relations(
	chatbotSettings,
	({ one }) => ({
		chatbot: one(chatbot, {
			fields: [chatbotSettings.chatbotId],
			references: [chatbot.id],
		}),
	})
);

export const chatbotConnections = chatbotSchema.table(
	"chatbot_connections",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		chatbotId: text("chatbotId")
			.notNull()
			.references(() => chatbot.id, { onDelete: "cascade" }),

		connectionName: text("connectionName").notNull(),
		connectionType: text("connectionType").notNull(),
		connectionSource: text("connectionSource").notNull(),
		connectionIcon: text("connectionIcon").notNull(),

		isActive: boolean("isActive").notNull().default(true),

		privateKey: text("privateKey").notNull(),
		publicKey: text("publicKey").notNull(),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date()),
		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(t) => [index("chatbot_connections_chatbot_idx").on(t.chatbotId)]
);

export const chatbotConnectionsRelations = relations(
	chatbotConnections,
	({ one }) => ({
		chatbot: one(chatbot, {
			fields: [chatbotConnections.chatbotId],
			references: [chatbot.id],
		}),
	})
);

export const conversations = chatbotSchema.table(
	"conversations",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		chatbotId: text("chatbotId")
			.notNull()
			.references(() => chatbot.id, { onDelete: "cascade" }),

		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),

		userId: text("user_id").references(() => user.id),

		externalUserId: text("externalUserId"),

		status: text("status").notNull().default("active"),

		totalTokens: integer("totalTokens").default(0),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		endedAt: timestamp("endedAt", { withTimezone: true }),

		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(table) => [
		index("conversations_chatbot_idx").on(table.chatbotId),
		index("conversations_org_idx").on(table.organizationId),
		index("conversations_user_idx").on(table.userId),
	]
);

export const conversationsRelations = relations(
	conversations,
	({ one, many }) => ({
		chatbot: one(chatbot, {
			fields: [conversations.chatbotId],
			references: [chatbot.id],
		}),

		organization: one(organization, {
			fields: [conversations.organizationId],
			references: [organization.id],
		}),

		user: one(user, {
			fields: [conversations.userId],
			references: [user.id],
		}),

		messages: many(messages),
	})
);

export const messages = chatbotSchema.table(
	"messages",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		conversationId: text("conversationId")
			.notNull()
			.references(() => conversations.id, { onDelete: "cascade" }),

		role: text("role").notNull(),
		// "user" | "assistant" | "system" | "tool"

		content: text("content").notNull(),

		tokenCount: integer("tokenCount"),

		model: text("model"),

		attachments: jsonb("attachments"),

		metadata: jsonb("metadata"),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		deletedAt: timestamp("deleted_at", { withTimezone: true }),
	},
	(table) => [
		{
			convoIdx: index("messages_conversation_idx").on(table.conversationId),
			createdIdx: index("messages_created_idx").on(table.createdAt),
		},
	]
);

export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),
}));

export const usageEvents = chatbotSchema.table("usage_events", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	organizationId: text("organizationId").notNull(),
	chatbotId: text("chatbotId"),
	tokens: integer("tokens").notNull(),
	cost: numeric("cost"),
	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),
	deletedAt: timestamp("deletedAt", { withTimezone: true }),
});

export const usageEventsRelations = relations(usageEvents, ({ one }) => ({
	organization: one(organization, {
		fields: [usageEvents.organizationId],
		references: [organization.id],
	}),

	chatbot: one(chatbot, {
		fields: [usageEvents.chatbotId],
		references: [chatbot.id],
	}),
}));
