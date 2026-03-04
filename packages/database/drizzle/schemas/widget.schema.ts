import { relations } from "drizzle-orm";
import { jsonb, pgSchema, text } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

export const widgetSchema = pgSchema("widget");

export const widget = widgetSchema.table("widget", {
	organizationId: text("organizationId")
		.primaryKey()
		.references(() => organization.id, { onDelete: "cascade" }),

	canvas: jsonb("canvas")
		.$type<{
			branding?: {
				logo?: string;
				colors?: {
					brand?: string;
					primary?: string;
					secondary?: string;
					accent?: string;
				};
			};
			locale?: string;
			timezone?: string;
			workingHours?: {
				startTime?: string;
				endTime?: string;
				days?: {
					mon?: boolean;
					tue?: boolean;
					wed?: boolean;
					thu?: boolean;
					fri?: boolean;
					sat?: boolean;
					sun?: boolean;
				};
			};
		}>()
		.default({}),
});

export const widgetRelations = relations(widget, ({ one }) => ({
	organization: one(organization, {
		fields: [widget.organizationId],
		references: [organization.id],
		relationName: "organizationWidget",
	}),
}));
