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

export const onboarding = profileSchema.table(
	"onboarding",
	{
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		currentStepId: text("currentStepId").notNull().default("welcome"),

		flowData: jsonb("flowData").$type<Record<string, unknown>>(),

		startedAt: timestamp("startedAt", { withTimezone: true }),

		completedAt: timestamp("completedAt", { withTimezone: true }),

		skippedAt: timestamp("skippedAt", { withTimezone: true }),

		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date()),

		deletedAt: timestamp("deletedAt", { withTimezone: true }),
	},
	(t) => [primaryKey({ columns: [t.userId, t.currentStepId] })]
);

export const profileRelations = relations(profile, ({ one }) => ({
	user: one(user, {
		fields: [profile.userId],
		references: [user.id],
		relationName: "userProfile",
	}),

	onboarding: one(onboarding, {
		fields: [profile.userId],
		references: [onboarding.userId],
		relationName: "userOnboarding",
	}),
}));
