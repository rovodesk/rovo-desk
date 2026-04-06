import { Placeholder } from "lib/utils";
import type { WidgetConfig } from "../types/widget";

export const defaultWidgetConfig = (
	companyName = "Acme",
	logo: string = Placeholder.logo(companyName, "shapes")
): WidgetConfig => {
	return {
		theme: {
			primaryColor: "#2563eb",
			secondaryColor: "#f1f5f9",
			brandColor: "#2563eb",
			bubbleStyle: "rounded",
			borderRadius: 24,
			shadow: true,
		},

		launcher: {
			position: "right",
			logo,
			labelText: `Chat with ${companyName}`,
			compact: false,
		},

		screens: {
			visitor: {
				defaultTab: "welcome",
				screens: [
					{
						id: "welcome",
						tab: "welcome",
						title: "Home",

						blocks: [
							{
								id: "welcome-block",
								type: "welcome",
								enabled: true,

								config: {
									title: "Hello there 👋",
									subtitle: "How can we help you today?",

									showOnlineAvatars: true,
									showConversationShortcut: true,
									showSearchBar: true,
									showRecentlyPublishedArticles: true,
									showMostViewedArticles: true,
								},
							},
						],
					},

					{
						id: "knowledge-base",
						tab: "knowledge_base",
						title: "Help",

						blocks: [
							{
								id: "kb-main",
								type: "knowledge_base",
								enabled: true,

								config: {
									showSearchBar: true,
									showCategoryCount: true,
									showArticlesPerCategoryCount: true,
									enableLanguageSwitcher: false,
								},
							},
						],
					},
					{
						id: "article-detail",
						route: "article_detail",
						title: "Article",

						blocks: [
							{
								id: "kb-article",
								type: "knowledge_base",
								enabled: true,

								config: {
									showSearchBar: false,
									showCategoryCount: false,
									showArticlesPerCategoryCount: false,
									enableLanguageSwitcher: false,
								},
							},
						],
					},
				],
			},

			user: {
				defaultTab: "conversation",

				screens: [
					{
						id: "conversation",
						tab: "conversation",
						title: "Messages",

						blocks: [
							{
								id: "conversation-main",
								type: "conversation",
								enabled: true,

								config: {
									headerTitle: `${companyName} Support`,
									subtitle: "We usually reply within a few minutes",
									placeholder: "Type your message...",
									welcomeMessage: "Hello! How can we help you today?",

									showBadge: true,
									allowAttachments: true,
									allowEmojis: true,
									allowGIFs: true,
									allowVoiceNotes: false,

									showTypingIndicator: true,
									showOnlineStatus: true,
									showAvatars: true,
									showReadReceipts: true,
									showTimestamp: true,

									autoOpenChat: true,
								},
							},
						],
					},

					{
						id: "knowledge-base",
						tab: "knowledge_base",
						title: "Help",

						blocks: [
							{
								id: "kb-main",
								type: "knowledge_base",
								enabled: true,

								config: {
									showSearchBar: true,
									showCategoryCount: true,
									showArticlesPerCategoryCount: true,
									enableLanguageSwitcher: false,
								},
							},
						],
					},

					{
						id: "publications",
						tab: "publications",
						title: "News",

						blocks: [
							{
								id: "news-feed",
								type: "publications",
								enabled: true,

								config: {
									showLatestFirst: true,
									showMostViewedFirst: false,
									showAuthorAvatar: true,
									showAuthorName: true,
									showBannerImage: true,
									showTeamAvatar: true,
								},
							},
						],
					},
					{
						id: "article-detail",
						route: "article_detail",
						title: "Article",

						blocks: [
							{
								id: "kb-article",
								type: "knowledge_base",
								enabled: true,

								config: {
									showSearchBar: false,
									showCategoryCount: false,
									showArticlesPerCategoryCount: false,
									enableLanguageSwitcher: false,
								},
							},
						],
					},
				],
			},
		},
		advanced: {
			showOnPages: "",
			hideOnPages: "",
			showAfterDelay: 10,
			customCss: "",
			hideLauncher: false,
			programmaticControl: false,
		},
	};
};
