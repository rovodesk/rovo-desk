import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgSchema,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";

export const billingSchema = pgSchema("billing");

export const subscriptions = billingSchema.table(
	"subscriptions",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		userId: text("userId").references(() => user.id, {
			onDelete: "set null",
		}),

		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),

		polarSubscriptionId: text("polarSubscriptionId").notNull(),
		polarCustomerId: text("polarCustomerId").notNull(),
		polarProductId: text("polar_product_id").notNull(),

		status: text("status").notNull(),

		seats: integer("seats"),

		metadata: jsonb("metadata").notNull().default({}),

		createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
		modifiedAt: timestamp("modifiedAt", { withTimezone: true }).notNull(),
	},
	(t) => [
		unique("subscriptionsPolarSubscriptionIdIdx").on(t.polarSubscriptionId),
		index("subscriptionsOrgIdx").on(t.organizationId),
		index("subscriptionsStatusIdx").on(t.status),
	]
);

export const subscriptionsRelations = relations(
	subscriptions,
	({ one, many }) => ({
		periods: many(subscriptionPeriods),
		pricing: many(subscriptionPricing),
		cancellation: one(subscriptionCancellations),
	})
);

export const subscriptionPeriods = billingSchema.table(
	"subscriptionPeriods",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		subscriptionId: text("subscriptionId")
			.notNull()
			.references(() => subscriptions.id, { onDelete: "cascade" }),

		currentPeriodStart: timestamp("currentPeriodStart", {
			withTimezone: true,
		}),
		currentPeriodEnd: timestamp("currentPeriodEnd", {
			withTimezone: true,
		}),

		trialStart: timestamp("trialStart", { withTimezone: true }),
		trialEnd: timestamp("trialEnd", { withTimezone: true }),

		startedAt: timestamp("startedAt", { withTimezone: true }),
		endsAt: timestamp("endsAt", { withTimezone: true }),
		endedAt: timestamp("endedAt", { withTimezone: true }),

		cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),

		createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
	},
<<<<<<< HEAD
	(t) => [
		unique("subscriptionPeriodsSubscriptionIdUnique").on(t.subscriptionId),
	]
=======
	(t) => [index("subscriptionPeriodsSubscriptionIdx").on(t.subscriptionId)]
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
);

export const subscriptionPeriodsRelations = relations(
	subscriptionPeriods,
	({ one }) => ({
		subscription: one(subscriptions, {
			fields: [subscriptionPeriods.subscriptionId],
			references: [subscriptions.id],
			relationName: "subscriptionPeriodsSubscription",
		}),
	})
);

export const subscriptionPricing = billingSchema.table(
	"subscriptionPricing",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		subscriptionId: text("subscriptionId")
			.notNull()
			.references(() => subscriptions.id, { onDelete: "cascade" }),

		amount: integer("amount").notNull(), // cents
		currency: text("currency").notNull(),

		interval: text("interval").notNull(),
		intervalCount: integer("intervalCount").notNull(),

		polarCheckoutId: text("polarCheckoutId"),
		polarDiscountId: text("polarDiscountId"),

		createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
	},
<<<<<<< HEAD
	(t) => [
		unique("subscriptionPricingSubscriptionIdUnique").on(t.subscriptionId),
	]
=======
	(t) => [index("subscriptionPricingSubscriptionIdx").on(t.subscriptionId)]
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
);

export const subscriptionPricingRelations = relations(
	subscriptionPricing,
	({ one }) => ({
		subscription: one(subscriptions, {
			fields: [subscriptionPricing.subscriptionId],
			references: [subscriptions.id],
			relationName: "subscriptionPricingSubscription",
		}),
	})
);

export const subscriptionCancellations = billingSchema.table(
	"subscriptionCancellations",
	{
		subscriptionId: text("subscriptionId")
			.primaryKey()
			.references(() => subscriptions.id, { onDelete: "cascade" }),

		canceledAt: timestamp("canceledAt", { withTimezone: true }),

		reason: text("customerCancellationReason"),
		comment: text("customerCancellationComment"),
<<<<<<< HEAD
	},
	(t) => [
		unique("subscriptionCancellationsSubscriptionIdUnique").on(
			t.subscriptionId
		),
	]
=======
	}
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
);

export const subscriptionCancellationsRelations = relations(
	subscriptionCancellations,
	({ one }) => ({
		subscription: one(subscriptions, {
			fields: [subscriptionCancellations.subscriptionId],
			references: [subscriptions.id],
			relationName: "subscriptionCancellationsSubscription",
		}),
	})
);
