import { WidgetConfigSchema } from "@zero-heads-lab/shared/validations/widget";
import { z } from "zod";

export const updateWidgetConfigSchema = WidgetConfigSchema.partial({
	theme: true,
	launcher: true,
	screens: true,
	advanced: true,
});

export const UPDATE_WIDGET_CONFIG_INPUT_DTO = z.object({
	widgetConfig: updateWidgetConfigSchema,
});

export const WIDGET_DTO = z.object({
	config: WidgetConfigSchema.nullable(),
	version: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
