import { relations } from "drizzle-orm";
import {
	jsonb,
	pgSchema,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { subscription } from "schema";
import { user } from "./auth.schema";

export const profileSchema = pgSchema("profile");

export const profile = profileSchema.table("profile", {
	userId: text("userId")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),

	subscriptionId: text("subscriptionId").references(() => subscription.id, {
		onDelete: "set null",
	}),

	settings: jsonb("settings")
		.$type<{
			theme?: "light" | "dark" | "system";
			locale?: string;
			timezone?: string;
			emailNotifications?: boolean;
		}>()
		.default({}),

	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updatedAt: timestamp("updatedAt", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date()),

	deletedAt: timestamp("deletedAt", { withTimezone: true }),
});

export const onboardingFlow = profileSchema.table("onboardingFlow", {
	userId: text("userId")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),

	startedAt: timestamp("startedAt", { withTimezone: true }),

	completedAt: timestamp("completedAt", { withTimezone: true }),

	flowData: jsonb("flowData")
		.$type<Record<string, unknown>>()
		.notNull()
		.default({}),

	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updatedAt: timestamp("updatedAt", { withTimezone: true }).$onUpdate(
		() => new Date()
	),
});

export const onboardingStep = profileSchema.table(
	"onboardingStep",
	{
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		stepId: text("stepId").notNull(),

		metadata: jsonb("metadata")
			.$type<Record<string, unknown>>()
			.notNull()
			.default({}),

		startedAt: timestamp("startedAt", { withTimezone: true }),

		completedAt: timestamp("completedAt", { withTimezone: true }),

		skippedAt: timestamp("skippedAt", { withTimezone: true }),
	},
	(t) => [primaryKey({ columns: [t.userId, t.stepId] })]
);

export const profileRelations = relations(profile, ({ one, many }) => ({
	user: one(user, {
		fields: [profile.userId],
		references: [user.id],
		relationName: "userProfile",
	}),

	onboardingFlow: one(onboardingFlow, {
		fields: [profile.userId],
		references: [onboardingFlow.userId],
		relationName: "userOnboardingFlow",
	}),

	onboardingSteps: many(onboardingStep, {
		relationName: "userOnboardingSteps",
	}),
}));
