import type { WidgetConfig } from "@zero-heads-lab/shared/lib/types";
import { relations } from "drizzle-orm";
import { integer, jsonb, pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

export const widgetSchema = pgSchema("widget");

export const widget = widgetSchema.table("widget", {
	organizationId: text("organizationId")
		.primaryKey()
		.references(() => organization.id, { onDelete: "cascade" }),

	config: jsonb("config").$type<WidgetConfig>(),

	version: integer("version").notNull().default(1),

	createdAt: timestamp("createdAt", { withTimezone: true })
		.notNull()
		.defaultNow(),

	updatedAt: timestamp("updatedAt", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const widgetRelations = relations(widget, ({ one }) => ({
	organization: one(organization, {
		fields: [widget.organizationId],
		references: [organization.id],
		relationName: "organizationWidget",
	}),
}));
