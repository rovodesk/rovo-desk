import { relations } from "drizzle-orm";
import {
	boolean,
	jsonb,
	pgSchema,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { subscription } from "schema";
import { organization, team, user } from "./auth.schema";

export const profileSchema = pgSchema("profile");

export const profile = profileSchema.table("profile", {
	userId: text("userId")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),

	currentOnboardingStep: text("currentOnboardingStep"),

	onboardingStartedAt: timestamp("onboardingStartedAt", {
		withTimezone: true,
	}).defaultNow(),

	onboardingCompletedAt: timestamp("onboardingCompletedAt", {
		withTimezone: true,
	}),

	organizationId: text("organizationId").references(() => organization.id),

	teamId: text("teamId").references(() => team.id),

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

export const onboardingProgress = profileSchema.table(
	"onboarding_progress",
	{
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		step: text("step"),

		completed: boolean("completed").notNull().default(false),
		skipped: boolean("skipped").notNull().default(false),

		completedAt: timestamp("completedAt", { withTimezone: true }),

		metadata: jsonb("metadata")
			.$type<Record<string, unknown>>()
			.notNull()
			.default({}),

		createdAt: timestamp("createdAt", { withTimezone: true })
			.defaultNow()
			.notNull(),

		updatedAt: timestamp("updatedAt", { withTimezone: true }).$onUpdate(
			() => new Date()
		),
	},
	(t) => [
		primaryKey({
			columns: [t.userId, t.step],
		}),
	]
);

export const onboardingContext = profileSchema.table("onboarding_context", {
	userId: text("userId")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),

	accountType: text("accountType"),
	companySize: text("companySize"),
	source: text("source"),
	priorToolsUsed: boolean("priorToolsUsed"),

	primaryGoal: text("primaryGoal"),
	secondaryGoal: text("secondaryGoal"),

	createdAt: timestamp("createdAt", { withTimezone: true })
		.defaultNow()
		.notNull(),

	updatedAt: timestamp("updatedAt", { withTimezone: true }).$onUpdate(
		() => new Date()
	),
});

export const profileRelations = relations(profile, ({ one, many }) => ({
	user: one(user, {
		fields: [profile.userId],
		references: [user.id],
		relationName: "userProfile",
	}),

	onboardingProgress: many(onboardingProgress, {
		relationName: "userOnboardingProgress",
	}),

	onboardingContext: one(onboardingContext, {
		fields: [profile.userId],
		references: [onboardingContext.userId],
		relationName: "userOnboardingContext",
	}),
}));
