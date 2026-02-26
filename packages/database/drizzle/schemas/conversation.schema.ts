import { relations } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgSchema,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { sdk, sdkConnections } from "./sdk.schema";

export const conversationSchema = pgSchema("conversation");

export const conversations = conversationSchema.table(
	"conversations",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		connectionId: text("connectionId")
			.notNull()
			.references(() => sdkConnections.id, { onDelete: "cascade" }),

		sdkId: text("sdkId")
			.notNull()
			.references(() => sdk.id, { onDelete: "cascade" }),

		organizationId: text("organizationId").references(() => organization.id),

		senderId: text("senderId"),

		status: text("status").notNull().default("active"),

		totalTokens: integer("totalTokens").default(0),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		endedAt: timestamp("endedAt", { withTimezone: true }),

		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(table) => [
		index("conversations_sdk_idx").on(table.sdkId),
		index("conversations_org_idx").on(table.organizationId),
		index("conversations_sender_idx").on(table.senderId),
	]
);

export const conversationsRelations = relations(
	conversations,
	({ one, many }) => ({
		connection: one(sdkConnections, {
			fields: [conversations.connectionId],
			references: [sdkConnections.id],
		}),

		sdk: one(sdk, {
			fields: [conversations.sdkId],
			references: [sdk.id],
		}),

		organization: one(organization, {
			fields: [conversations.organizationId],
			references: [organization.id],
		}),

		messages: many(messages),
	})
);

export const messages = conversationSchema.table(
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
