import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	numeric,
	pgSchema,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

export const billingSchema = pgSchema("billing");

/* -------------------------------------------------------------------------- */
/*                                   ENUMS                                    */
/* -------------------------------------------------------------------------- */

export const subscriptionStatusEnum = billingSchema.enum("subscriptionStatus", [
	"trialing",
	"active",
	"past_due",
	"canceled",
	"incomplete",
	"incomplete_expired",
	"unpaid",
]);

export const billingIntervalEnum = billingSchema.enum("billingInterval", [
	"month",
	"year",
]);

export const usageEventTypeEnum = billingSchema.enum("usageEventType", [
	"aiTokens",
	"apiCalls",
	"storage",
	"bandwidth",
	"custom",
]);

/* -------------------------------------------------------------------------- */
/*                                    PLAN                                    */
/* The preferred way to manage plans is to use Stripe's built-in plan management.
/* This allows you to manage your plans in the Stripe dashboard and sync them to your database.
/* -------------------------------------------------------------------------- */
export const plan = billingSchema.table(
	"plan",
	{
		/**
		 * Stable internal plan id
		 * e.g. free, pro, team, enterprise
		 */
		id: text("id").primaryKey(),

		name: text("name").notNull().unique(),

		/**
		 * Whether the plan is free / paid
		 */
		isFree: boolean("isFree").notNull().default(false),

		/**
		 * Whether users can newly subscribe to this plan
		 */
		isActive: boolean("isActive").notNull().default(true),

		/**
		 * Stripe mappings
		 */
		stripeProductId: text("stripeProductId"),
		stripeMonthlyPriceId: text("stripeMonthlyPriceId"),
		stripeAnnualPriceId: text("stripeAnnualPriceId"),

		/**
		 * Cached display pricing (minor units)
		 * Example INR 999 => 99900 if you store paise
		 * OR store 999 if your app convention is rupees only.
		 *
		 * Pick ONE convention and stick to it everywhere.
		 */
		monthlyPrice: integer("monthlyPrice"),
		annualPrice: integer("annualPrice"),
		currency: text("currency").notNull().default("inr"),

		/**
		 * Feature limits / flags
		 * Example:
		 * {
		 *   maxProjects: 10,
		 *   maxMembers: 5,
		 *   aiCredits: 100000,
		 *   prioritySupport: true
		 * }
		 */
		metadata: jsonb("metadata").$type<Record<string, unknown>>(),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.notNull()
			.defaultNow(),

		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [
		uniqueIndex("planNameUidx").on(t.name),
		uniqueIndex("planStripeProductIdUidx").on(t.stripeProductId),
		uniqueIndex("planStripeMonthlyPriceIdUidx").on(t.stripeMonthlyPriceId),
		uniqueIndex("planStripeAnnualPriceIdUidx").on(t.stripeAnnualPriceId),
		index("planIsActiveIdx").on(t.isActive),
	]
);

/* -------------------------------------------------------------------------- */
/*                               SUBSCRIPTION                                 */
/* -------------------------------------------------------------------------- */

export const subscription = billingSchema.table(
	"subscription",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		/**
		 * Owning organization / tenant
		 */
		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, {
				onDelete: "cascade",
			}),

		planId: text("planId")
			.notNull()
			.references(() => plan.id, {
				onDelete: "restrict",
			}),

		/**
		 * Stripe identifiers
		 */
		stripeCustomerId: text("stripeCustomerId"),
		stripeSubscriptionId: text("stripeSubscriptionId"),

		status: subscriptionStatusEnum("status").notNull(),

		/**
		 * Billing cadence
		 */
		interval: billingIntervalEnum("interval"),

		/**
		 * Period tracking
		 */
		periodStart: timestamp("periodStart", { withTimezone: true }),
		periodEnd: timestamp("periodEnd", { withTimezone: true }),
		currentPeriodEnd: timestamp("currentPeriodEnd", {
			withTimezone: true,
		}),

		/**
		 * Cancellation lifecycle
		 */
		cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),
		cancelAt: timestamp("cancelAt", { withTimezone: true }),
		canceledAt: timestamp("canceledAt", { withTimezone: true }),
		endedAt: timestamp("endedAt", { withTimezone: true }),

		/**
		 * Trial lifecycle
		 */
		trialStart: timestamp("trialStart", { withTimezone: true }),
		trialEnd: timestamp("trialEnd", { withTimezone: true }),

		/**
		 * Team / seat-based billing
		 */
		seats: integer("seats").notNull().default(1),

		/**
		 * Snapshot pricing at subscription time
		 * Important so historical subscriptions remain accurate
		 * even if Stripe price changes later.
		 */
		unitPrice: integer("unitPrice"),
		currency: text("currency").notNull().default("inr"),

		/**
		 * Extra webhook/debug metadata if needed
		 */
		metadata: jsonb("metadata").$type<Record<string, unknown>>(),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.notNull()
			.defaultNow(),

		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.notNull()
			.defaultNow(),

		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(t) => [
		index("subscriptionOrganizationIdIdx").on(t.organizationId),
		index("subscriptionPlanIdIdx").on(t.planId),
		index("subscriptionStatusIdx").on(t.status),

		uniqueIndex("subscriptionStripeCustomerIdUidx").on(t.stripeCustomerId),
		uniqueIndex("subscriptionStripeSubscriptionIdUidx").on(
			t.stripeSubscriptionId
		),
	]
);

/* -------------------------------------------------------------------------- */
/*                                USAGE EVENTS                                */
/* -------------------------------------------------------------------------- */

export const usageEvent = billingSchema.table(
	"usage_event",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, {
				onDelete: "cascade",
			}),

		subscriptionId: text("subscriptionId").references(() => subscription.id, {
			onDelete: "set null",
		}),

		type: usageEventTypeEnum("type").notNull(),

		/**
		 * Example:
		 * - ai_tokens => 12345
		 * - api_calls => 100
		 * - storage => MB/GB depending on your convention
		 */
		quantity: integer("quantity").notNull(),

		/**
		 * Cost snapshot for this event
		 */
		cost: numeric("cost", { precision: 12, scale: 4 }).notNull(),

		/**
		 * Optional idempotency / trace / external reference
		 * Useful for queue-driven systems
		 */
		referenceId: text("referenceId"),

		metadata: jsonb("metadata").$type<Record<string, unknown>>(),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.notNull()
			.defaultNow(),

		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(t) => [
		index("usageEventOrganizationIdIdx").on(t.organizationId),
		index("usageEventSubscriptionIdIdx").on(t.subscriptionId),
		index("usageEventTypeIdx").on(t.type),
		index("usageEventCreatedAtIdx").on(t.createdAt),
		uniqueIndex("usageEventOrganizationReferenceIdUidx").on(
			t.organizationId,
			t.referenceId
		),
	]
);

export const webhookEventStatusEnum = billingSchema.enum(
	"webhook_event_status",
	["received", "processing", "processed", "failed", "ignored"]
);

export const stripeWebhookEvent = billingSchema.table(
	"stripe_webhook_event",
	{
		id: text("id").primaryKey(), // Stripe event.id
		type: text("type").notNull(),
		apiVersion: text("api_version"),
		account: text("account"),

		/**
		 * Stripe object id for dedupe / debugging
		 * e.g. sub_xxx, cs_xxx, in_xxx
		 */
		objectId: text("object_id"),

		status: webhookEventStatusEnum("status").notNull().default("received"),

		/**
		 * Entire Stripe event payload snapshot
		 */
		payload: jsonb("payload").notNull().$type<Record<string, unknown>>(),

		receivedAt: timestamp("received_at", { withTimezone: true })
			.notNull()
			.defaultNow(),

		processedAt: timestamp("processed_at", { withTimezone: true }),

		error: text("error"),

		/**
		 * Useful for retry count if you later want manual replay
		 */
		attempts: text("attempts").notNull().default("0"),
	},
	(t) => [
		index("stripe_webhook_event_type_idx").on(t.type),
		index("stripe_webhook_event_status_idx").on(t.status),
		index("stripe_webhook_event_object_id_idx").on(t.objectId),
		uniqueIndex("stripe_webhook_event_id_uidx").on(t.id),
	]
);

/* -------------------------------------------------------------------------- */
/*                                 RELATIONS                                  */
/* -------------------------------------------------------------------------- */

export const planRelations = relations(plan, ({ many }) => ({
	subscriptions: many(subscription),
}));

export const subscriptionRelations = relations(
	subscription,
	({ one, many }) => ({
		organization: one(organization, {
			fields: [subscription.organizationId],
			references: [organization.id],
		}),
		plan: one(plan, {
			fields: [subscription.planId],
			references: [plan.id],
		}),
		usageEvents: many(usageEvent),
	})
);

export const usageEventRelations = relations(usageEvent, ({ one }) => ({
	organization: one(organization, {
		fields: [usageEvent.organizationId],
		references: [organization.id],
	}),
	subscription: one(subscription, {
		fields: [usageEvent.subscriptionId],
		references: [subscription.id],
	}),
}));
