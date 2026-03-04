export interface WidgetTheme {
	primaryColor: string;
	backgroundColor: string;
	textColor: string;
	headerColor: string;
	logoUrl: string;
	companyName: string;
	headerTitle: string;
	subtitle: string;
	borderRadius: number;
	widgetWidth: number;
	widgetHeight: number;
	shadow: boolean;
}

export interface WidgetLauncher {
	position: "left" | "right";
	icon: string;
	logo?: string;
	labelText: string;
	showLabel: boolean;
	showOnMobile: boolean;
	showOnDesktop: boolean;
	hideDefault: boolean;
}

export type HomeBlockType =
	| "welcome"
	| "conversation"
	| "knowledge_base"
	| "announcement"
	| "cta";

export interface HomeBlock {
	id: string;
	type: HomeBlockType;
	enabled: boolean;
	config: Record<string, unknown>;
}

export interface WidgetScreens {
	visitors: HomeBlock[];
	users: HomeBlock[];
}

export interface WidgetConversation {
	bubbleStyle: "rounded" | "square";
	userBubbleColor: string;
	agentBubbleColor: string;
	showAgentAvatar: boolean;
	showOnlineStatus: boolean;
	headerTitle: string;
	placeholderText: string;
	sendButtonStyle: "icon" | "text";
}

export interface WidgetBehavior {
	autoOpenChat: boolean;
	welcomeMessage: string;
	enableAttachments: boolean;
	enableEmojiPicker: boolean;
	enableTypingIndicator: boolean;
	offlineMessage: string;
	showEmailFormOffline: boolean;
}

export interface WidgetAdvanced {
	showOnPages: string;
	hideOnPages: string;
	customCss: string;
	hideLauncher: boolean;
	programmaticControl: boolean;
}

export interface WidgetConfig {
	theme: WidgetTheme;
	launcher: WidgetLauncher;
	screens: WidgetScreens;
	conversation: WidgetConversation;
	behavior: WidgetBehavior;
	advanced: WidgetAdvanced;
}

export function defaultWidgetConfig(
	companyName?: string,
	logo?: string
): WidgetConfig {
	return {
		theme: {
			primaryColor: "#2563eb",
			backgroundColor: "#ffffff",
			textColor: "#1e293b",
			headerColor: "#2563eb",
			logoUrl: logo ?? "",
			companyName: companyName ?? "Zero Heads",
			headerTitle: "Hi there 👋",
			subtitle: "We usually reply within a few minutes",
			borderRadius: 16,
			widgetWidth: 380,
			widgetHeight: 600,
			shadow: true,
		},
		launcher: {
			position: "right",
			icon: "message-circle",
			logo: logo ?? "",
			labelText: "Chat with us",
			showLabel: false,
			showOnMobile: true,
			showOnDesktop: true,
			hideDefault: false,
		},
		screens: {
			visitors: [
				{
					id: "1",
					type: "welcome",
					enabled: true,
					config: {
						title: "Welcome!",
						subtitle: "How can we help you today?",
						showAvatar: true,
					},
				},
				{
					id: "2",
					type: "conversation",
					enabled: true,
					config: { label: "Send us a message" },
				},
				{
					id: "3",
					type: "knowledge_base",
					enabled: true,
					config: { articleLimit: 5, category: "All" },
				},
			],
			users: [
				{
					id: "1",
					type: "welcome",
					enabled: true,
					config: {
						title: "Welcome back!",
						subtitle: "How can we help you today?",
						showAvatar: true,
					},
				},
				{
					id: "2",
					type: "conversation",
					enabled: true,
					config: { label: "Send us a message" },
				},
				{
					id: "3",
					type: "knowledge_base",
					enabled: true,
					config: { articleLimit: 5, category: "All" },
				},
			],
		},
		conversation: {
			bubbleStyle: "rounded",
			userBubbleColor: "#2563eb",
			agentBubbleColor: "#f1f5f9",
			showAgentAvatar: true,
			showOnlineStatus: true,
			headerTitle: "Acme Support",
			placeholderText: "Type a message...",
			sendButtonStyle: "icon",
		},
		behavior: {
			autoOpenChat: false,
			welcomeMessage: "Hello! How can we help you today?",
			enableAttachments: true,
			enableEmojiPicker: true,
			enableTypingIndicator: true,
			offlineMessage: "We're currently offline. Leave a message!",
			showEmailFormOffline: true,
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
