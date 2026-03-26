import { z } from "zod";

export const WidgetAppearanceSchema = z.object({
	primaryColor: z.string(),
	secondaryColor: z.string(),
	brandColor: z.string(),

	bubbleStyle: z.enum(["rounded", "square"]),
	borderRadius: z.number(),

	shadow: z.boolean(),
});

export const WidgetLauncherSchema = z.object({
	position: z.enum(["left", "right"]),
	logo: z.string().optional(),
	labelText: z.string(),
	compact: z.boolean(),
});

export const WidgetAdvancedConfigSchema = z.object({
	showOnPages: z.string(),
	hideOnPages: z.string(),
	showAfterDelay: z.number(),
	customCss: z.string(),
	hideLauncher: z.boolean(),
	programmaticControl: z.boolean(),
});

export const TabTypeSchema = z.enum([
	"welcome",
	"conversation",
	"inbox",
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

export const InboxBlockSchema = z.object({
	id: z.string(),
	type: z.literal("inbox"),
});

export const AnyBlockSchema = z.discriminatedUnion("type", [
	WelcomeBlockSchema,
	ConversationBlockSchema,
	KnowledgeBaseBlockSchema,
	PublicationsBlockSchema,
	InboxBlockSchema,
]);

export const WidgetScreenSchema = z.object({
	id: z.string(),
	tab: TabTypeSchema.optional(),
	route: z.string().optional(),
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
	theme: WidgetAppearanceSchema,
	launcher: WidgetLauncherSchema,
	screens: WidgetModeConfigSchema,
	advanced: WidgetAdvancedConfigSchema,
});

export const SDKThemeModeSchema = z.enum(["dark", "light", "system"]);

export const SDKDisplayOptionsSchema = z.object({
	offset: z
		.object({
			horizontal: z.number().optional(),
			vertical: z.number().optional(),
			zIndex: z.number().optional(),
		})
		.optional(),
	themeMode: SDKThemeModeSchema.optional(),
});

export const SDKUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	createdAt: z.string(),
	signature: z.string(),
});

export const SDKConfigSchema = z.object({
	accessKey: z.string(),
	organizationId: z.string(),
	apiBaseUrl: z.url(),
	user: SDKUserSchema.optional(),
	customLauncherComponent: z.string().optional(),
	display: SDKDisplayOptionsSchema.optional(),
	sessionDuration: z.number().optional(),
});
