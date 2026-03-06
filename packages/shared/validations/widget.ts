import z from "zod";

export const WidgetThemeAppearanceSchema = z.object({
	primaryColor: z.string(),
	backgroundColor: z.string(),
	textColor: z.string(),

	bubbleStyle: z.enum(["rounded", "square"]),
	userBubbleColor: z.string(),
	agentBubbleColor: z.string(),

	borderRadius: z.number(),
	widgetWidth: z.number(),
	widgetHeight: z.number(),
	shadow: z.boolean(),
});

export const WidgetLauncherAppearanceSchema = z.object({
	position: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
	logo: z.string().optional(),
	labelText: z.string(),
	compact: z.boolean(),
});

export const WidgetAdvancedConfigSchema = z.object({
	showOnPages: z.string(),
	hideOnPages: z.string(),
	customCss: z.string(),
	hideLauncher: z.boolean(),
	programmaticControl: z.boolean(),
});

export const TabTypeSchema = z.enum([
	"welcome",
	"conversation",
	"knowledge_base",
	"publications",
]);

export const WelcomeConfigSchema = z.object({
	title: z.string(),
	subtitle: z.string(),
	showOnlineAvatars: z.boolean(),
	showConversationShortcut: z.boolean(),
	showSearchBar: z.boolean(),
	showRecentlyPublishedArticles: z.boolean(),
	showMostViewedArticles: z.boolean(),
});

export const ConversationConfigSchema = z.object({
	headerTitle: z.string(),
	subtitle: z.string(),
	placeholder: z.string(),
	welcomeMessage: z.string(),

	showBadge: z.boolean(),
	allowAttachments: z.boolean(),
	allowEmojis: z.boolean(),
	allowGIFs: z.boolean(),
	allowVoiceNotes: z.boolean(),

	showTypingIndicator: z.boolean(),
	showOnlineStatus: z.boolean(),
	showAvatars: z.boolean(),
	showReadReceipts: z.boolean(),
	showTimestamp: z.boolean(),

	autoOpenChat: z.boolean(),
});

export const KnowledgeBaseConfigSchema = z.object({
	showSearchBar: z.boolean(),
	showCategoryCount: z.boolean(),
	showArticlesPerCategoryCount: z.boolean(),
	enableLanguageSwitcher: z.boolean(),
});

export const PublicationsConfigSchema = z.object({
	showLatestFirst: z.boolean(),
	showMostViewedFirst: z.boolean(),
	showAuthorAvatar: z.boolean(),
	showAuthorName: z.boolean(),
	showBannerImage: z.boolean(),
	showTeamAvatar: z.boolean(),
});

/**
 * Block Schemas (Discriminated Union)
 * This is the correct way to validate your block system.
 */

export const WelcomeBlockSchema = z.object({
	id: z.string(),
	type: z.literal("welcome"),
	enabled: z.boolean(),
	config: WelcomeConfigSchema,
});

export const ConversationBlockSchema = z.object({
	id: z.string(),
	type: z.literal("conversation"),
	enabled: z.boolean(),
	config: ConversationConfigSchema,
});

export const KnowledgeBaseBlockSchema = z.object({
	id: z.string(),
	type: z.literal("knowledge_base"),
	enabled: z.boolean(),
	config: KnowledgeBaseConfigSchema,
});

export const PublicationsBlockSchema = z.object({
	id: z.string(),
	type: z.literal("publications"),
	enabled: z.boolean(),
	config: PublicationsConfigSchema,
});

export const AnyBlockSchema = z.discriminatedUnion("type", [
	WelcomeBlockSchema,
	ConversationBlockSchema,
	KnowledgeBaseBlockSchema,
	PublicationsBlockSchema,
]);

export const WidgetScreenSchema = z.object({
	id: z.string(),
	tab: TabTypeSchema,
	title: z.string(),
	blocks: z.array(AnyBlockSchema),
});

export const WidgetScreenConfigSchema = z.object({
	screens: z.array(WidgetScreenSchema),
	defaultTab: TabTypeSchema,
});

export const WidgetModeSchema = z.enum(["visitor", "user"]);

export const WidgetModeConfigSchema = z.record(
	WidgetModeSchema,
	WidgetScreenConfigSchema
);

export const WidgetConfigSchema = z.object({
	theme: WidgetThemeAppearanceSchema,
	launcher: WidgetLauncherAppearanceSchema,
	screens: WidgetModeConfigSchema,
	advanced: WidgetAdvancedConfigSchema,
});
