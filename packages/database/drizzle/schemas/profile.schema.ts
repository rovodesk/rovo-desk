import type {
	UserSettings,
	WorkspaceSettings,
} from "@zero-heads-lab/shared/types";
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
import { organization, user } from "./auth.schema";

export const profileSchema = pgSchema("profile");

export const userProfile = profileSchema.table("userProfile", {
	userId: text("userId")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),

	settings: jsonb("settings").$type<UserSettings>().default({}),

	isAway: boolean("isAway").notNull().default(false),

	workspaceProfileId: text("workspaceProfileId").references(
		() => workspaceProfile.organizationId,
		{
			onDelete: "cascade",
		}
	),
});

export const userProfileRelations = relations(userProfile, ({ one }) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id],
		relationName: "userProfile",
	}),

	onboarding: one(onboarding, {
		fields: [userProfile.userId],
		references: [onboarding.userId],
		relationName: "userOnboarding",
	}),
}));

export const workspaceProfile = profileSchema.table("workspaceProfile", {
	organizationId: text("organizationId")
		.primaryKey()
		.references(() => organization.id, { onDelete: "cascade" }),

	subscriptionId: text("subscriptionId").references(() => subscription.id, {
		onDelete: "set null",
	}),

	settings: jsonb("settings").$type<WorkspaceSettings>().default({}),
});

export const workspaceProfileRelations = relations(
	workspaceProfile,
	({ one }) => ({
		organization: one(organization, {
			fields: [workspaceProfile.organizationId],
			references: [organization.id],
			relationName: "workspaceProfile",
		}),
	})
);

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
