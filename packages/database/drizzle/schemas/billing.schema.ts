import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	index,
	integer,
	jsonb,
	pgSchema,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";
import { organization } from "schema";

export const billingSchema = pgSchema("billing");

export const plan = billingSchema.table("plan", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	price: integer("price").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true })
		.notNull()
		.defaultNow(),
	modifiedAt: timestamp("modifiedAt", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const subscription = billingSchema.table(
	"subscription",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		planId: text("planId")
			.notNull()
			.references(() => plan.id),

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

		metadata: jsonb("metadata"),
		trialStart: date("trialStart"),
		trialEnd: date("trialEnd"),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
	},
	(t) => [
		unique("subscriptionsReferenceIdIdx").on(t.referenceId),
		index("subscriptionsStatusIdx").on(t.status),
	]
);

export const subscriptionRelations = relations(subscription, ({ one }) => ({
	plan: one(plan, {
		fields: [subscription.planId],
		references: [plan.id],
	}),
}));
