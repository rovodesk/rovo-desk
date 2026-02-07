import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	index,
	integer,
	pgSchema,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";
import { organization } from "schema";

export const billingSchema = pgSchema("billing");

export const subscription = billingSchema.table(
	"subscription",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		plan: text("plan").notNull(),
		referenceId: text("referenceId")
			.notNull()
			.references(() => organization.id, {
				onDelete: "cascade",
			}),

		stripeCustomerId: text("stripeCustomerId"),
		stripeSubscriptionId: text("stripeSubscriptionId"),

		status: text("status").notNull(),

		periodStart: date("periodStart"),
		periodEnd: date("periodEnd"),

		cancelAtPeriodEnd: boolean("cancelAtPeriodEnd"),
		cancelAt: date("cancelAt"),
		canceledAt: date("canceledAt"),
		endedAt: date("endedAt"),

		seats: integer("seats"),

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
		metadata: jsonb("metadata"),
=======
		metadata: jsonb("metadata").notNull().default({}),
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
		metadata: jsonb("metadata"),
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
=======
		trialStart: date("trialStart"),
		trialEnd: date("trialEnd"),
>>>>>>> b062417 (feat: Migrate billing from Polar to Stripe, introducing Stripe client and customer helpers, updating billing schemas, and adjusting admin routes.)

		createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true }),
	},
	(t) => [
		unique("subscriptionsReferenceIdIdx").on(t.referenceId),
		index("subscriptionsStatusIdx").on(t.status),
	]
);

export const subscriptionRelations = relations(subscription, ({ one }) => ({
	plan: one(plan, {
		fields: [subscription.plan],
		references: [plan.id],
		relationName: "subscriptionPlan",
	}),
}));

export const plan = billingSchema.table("plan", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	price: integer("price").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
	modifiedAt: timestamp("modifiedAt", { withTimezone: true }).notNull(),
});

<<<<<<< HEAD
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
<<<<<<< HEAD
	(t) => [
		unique("subscriptionPeriodsSubscriptionIdUnique").on(t.subscriptionId),
	]
=======
	(t) => [index("subscriptionPeriodsSubscriptionIdx").on(t.subscriptionId)]
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
	(t) => [
		unique("subscriptionPeriodsSubscriptionIdUnique").on(t.subscriptionId),
	]
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
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
<<<<<<< HEAD
	(t) => [
		unique("subscriptionPricingSubscriptionIdUnique").on(t.subscriptionId),
	]
=======
	(t) => [index("subscriptionPricingSubscriptionIdx").on(t.subscriptionId)]
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
	(t) => [
		unique("subscriptionPricingSubscriptionIdUnique").on(t.subscriptionId),
	]
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
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
<<<<<<< HEAD
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
	},
	(t) => [
		unique("subscriptionCancellationsSubscriptionIdUnique").on(
			t.subscriptionId
		),
	]
<<<<<<< HEAD
=======
	}
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
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
=======
export const planRelations = relations(plan, ({ many }) => ({
	subscription: many(subscription, {
		relationName: "subscriptionPlan",
	}),
}));
>>>>>>> b062417 (feat: Migrate billing from Polar to Stripe, introducing Stripe client and customer helpers, updating billing schemas, and adjusting admin routes.)
