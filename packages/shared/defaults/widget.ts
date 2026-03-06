import type { WidgetConfig } from "../types/widget";

export function defaultWidgetConfig(
	companyName = "Acme",
	logo?: string
): WidgetConfig {
	return {
		theme: {
			primaryColor: "#2563eb",
			backgroundColor: "#ffffff",
			textColor: "#1e293b",

			bubbleStyle: "rounded",
			userBubbleColor: "#2563eb",
			agentBubbleColor: "#f1f5f9",

			borderRadius: 16,
			widgetWidth: 380,
			widgetHeight: 640,
			shadow: true,
		},

		launcher: {
			position: "bottom-right",
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
				],
			},
		},
		advanced: {
			showOnPages: "",
			hideOnPages: "",
			customCss: "",
			hideLauncher: false,
			programmaticControl: false,
		},
	};
}
