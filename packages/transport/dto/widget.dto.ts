import { z } from "zod";

export const widgetThemeSchema = z.object({
	primaryColor: z.string(),
	backgroundColor: z.string(),
	textColor: z.string(),
	headerColor: z.string(),
	logoUrl: z.string(),
	companyName: z.string(),
	headerTitle: z.string(),
	subtitle: z.string(),
	borderRadius: z.number(),
	widgetWidth: z.number(),
	widgetHeight: z.number(),
	shadow: z.boolean(),
});

export const widgetLauncherSchema = z.object({
	position: z.enum(["left", "right"]),
	icon: z.string(),
	labelText: z.string(),
	showLabel: z.boolean(),
	showOnMobile: z.boolean(),
	showOnDesktop: z.boolean(),
	hideDefault: z.boolean(),
});

export const homeBlockTypeSchema = z.enum([
	"welcome",
	"conversation",
	"knowledge_base",
	"announcement",
	"cta",
]);

export const homeBlockSchema = z.object({
	id: z.string(),
	type: homeBlockTypeSchema,
	enabled: z.boolean(),
	config: z.record(z.string(), z.unknown()),
});

export const widgetHomeSchema = z.object({
	visitors: z.array(homeBlockSchema),
	users: z.array(homeBlockSchema),
});

export const widgetConversationSchema = z.object({
	bubbleStyle: z.enum(["rounded", "square"]),
	userBubbleColor: z.string(),
	agentBubbleColor: z.string(),
	showAgentAvatar: z.boolean(),
	showOnlineStatus: z.boolean(),
	headerTitle: z.string(),
	placeholderText: z.string(),
	sendButtonStyle: z.enum(["icon", "text"]),
});

export const widgetBehaviorSchema = z.object({
	autoOpenChat: z.boolean(),
	welcomeMessage: z.string(),
	enableAttachments: z.boolean(),
	enableEmojiPicker: z.boolean(),
	enableTypingIndicator: z.boolean(),
	offlineMessage: z.string(),
	showEmailFormOffline: z.boolean(),
});

export const widgetAdvancedSchema = z.object({
	showOnPages: z.string(),
	hideOnPages: z.string(),
	customCss: z.string(),
	hideLauncher: z.boolean(),
	programmaticControl: z.boolean(),
});

export const widgetConfigSchema = z.object({
	theme: widgetThemeSchema,
	launcher: widgetLauncherSchema,
	screens: widgetHomeSchema,
	conversation: widgetConversationSchema,
	behavior: widgetBehaviorSchema,
	advanced: widgetAdvancedSchema,
});
export const updateWidgetConfigSchema = widgetConfigSchema.partial({
	theme: true,
	launcher: true,
	screens: true,
	conversation: true,
	behavior: true,
	advanced: true,
});

export const UPDATE_WIDGET_CONFIG_INPUT_DTO = z.object({
	widgetConfig: updateWidgetConfigSchema,
});

export const WIDGET_DTO = z.object({
	config: widgetConfigSchema.nullable(),
	version: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
