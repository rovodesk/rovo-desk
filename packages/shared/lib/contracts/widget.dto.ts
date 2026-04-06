import { z } from "zod";
import {
	SDKUserSchema,
	WidgetConfigSchema,
	WidgetModeSchema,
} from "../validations/widget";

/**
 * Base
 */
export const WidgetInitBaseSchema = z.object({
	success: z.literal(true),
	widgetConfig: z
		.union([WidgetConfigSchema, z.object({ config: WidgetConfigSchema })])
		.transform((val) => ("config" in val ? val.config : val)),
	mode: WidgetModeSchema,
});

/**
 * Visitor
 */
export const WidgetInitVisitorSchema = WidgetInitBaseSchema.extend({
	mode: z.literal("visitor"),
	// token: z.string(),
});

/**
 * User
 */
export const WidgetInitUserSchema = WidgetInitBaseSchema.extend({
	mode: z.literal("user"),
	token: z.string(),
	user: SDKUserSchema, // ✅ strict, no loose
});

/**
 * Request
 */
export const WIDGET_INIT_REQUEST = z.object({
	organizationId: z.string().min(1),
	// user: SDKUserSchema.partial().optional(), // ✅ flexible input
});

/**
 * Response (discriminated union)
 */
export const WIDGET_INIT_RESPONSE = z.discriminatedUnion("mode", [
	WidgetInitVisitorSchema,
	WidgetInitUserSchema,
]);

export const WIDGET_AUTH_REQUEST = z.object({});
export const WIDGET_AUTH_RESPONSE = z.object({});

export const WIDGET_CHATROOM_REQUEST = z.object({});
export const WIDGET_CHATROOM_RESPONSE = z.object({});

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
