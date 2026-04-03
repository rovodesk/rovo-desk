import {
	boolean,
	index,
	integer,
	jsonb,
	pgSchema,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const internalSchema = pgSchema("internal");

export const event = internalSchema.table(
	"event",
	{
		id: text("id").primaryKey(),

		type: text("type").notNull(),
		category: text("category").notNull(),

		source: text("source").notNull(),
		subject: text("subject").notNull(),

		version: integer("version").notNull().default(1),

		tenantId: text("tenant_id"),
		actorId: text("actor_id"),
		actorType: text("actor_type"),

		occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
		receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),

		priority: text("priority").default("normal"),

		metadata: jsonb("metadata").notNull().default({}),
		payload: jsonb("payload").notNull(),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		{
			typeIdx: index("events_type_idx").on(table.type),
			categoryIdx: index("events_category_idx").on(table.category),
			sourceIdx: index("events_source_idx").on(table.source),
			subjectIdx: index("events_subject_idx").on(table.subject),
			tenantIdx: index("events_tenant_idx").on(table.tenantId),
			occurredAtIdx: index("events_occurred_at_idx").on(table.occurredAt),
		},
	]
);

export const eventDeliveries = internalSchema.table(
	"event_deliveries",
	{
		id: text("id").primaryKey(),
		eventId: text("event_id").notNull(),

		handler: text("handler").notNull(),
		status: text("status").notNull(), // pending, processing, delivered, failed, dead_lettered

		attempts: integer("attempts").notNull().default(0),
		lastError: text("last_error"),

		nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
		deliveredAt: timestamp("delivered_at", { withTimezone: true }),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		{
			eventIdIdx: index("event_deliveries_event_id_idx").on(table.eventId),
			statusIdx: index("event_deliveries_status_idx").on(table.status),
		},
	]
);

export const idempotencyKeys = internalSchema.table(
	"idempotency_keys",
	{
		id: text("id").primaryKey(),

		/** logical namespace, e.g. webhook:kinde */
		scope: text("scope").notNull(),

		/** unique dedupe key, e.g. kinde_evt_123 */
		key: text("key").notNull(),

		/** optional provider name */
		provider: text("provider"),

		/** optional linked event id */
		eventId: text("event_id"),

		/** whether processing succeeded */
		processed: boolean("processed").notNull().default(false),

		/** optional debug metadata */
		metadata: jsonb("metadata").notNull().default({}),

		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),

		processedAt: timestamp("processed_at", { withTimezone: true }),
	},
	(table) => [
		index("idempotency_scope_idx").on(table.scope),
		index("idempotency_event_id_idx").on(table.eventId),
		uniqueIndex("idempotency_scope_key_uidx").on(table.scope, table.key),
	]
);
