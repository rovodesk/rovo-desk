import type { ChatMessage } from "@zero-heads-lab/shared/types";

export interface IMessageParser {
	parse(message: string): void;
}

export type MessageParserConstructor = new (
	actionProvider: ChatbotActionProvider
) => IMessageParser;

export type IUpdater = (
	updater: Partial<BotState> | ((state: BotState) => BotState)
) => void;

export interface ChatbotConfig {
	botName: string;
	initialMessages: ChatMessage[];
	state?: Record<string, unknown>;
	widgets?: WidgetConfig[];
}

export interface WidgetConfig {
	widgetName: string;
	widgetFunc: (props: unknown) => HTMLElement;
	mapStateToProps?: string[];
	props?: Record<string, unknown>;
}

export interface ChatbotActionProvider {
	createBotMessage: (
		message: string,
		options?: Record<string, unknown>
	) => ChatMessage;
	createUserMessage: (
		message: string,
		userId: string,
		username?: string
	) => ChatMessage;
	stateUpdater: IUpdater;
}

export type ActionProviderConstructor = new (
	createBotMessage: (
		message: string,
		options?: Record<string, unknown>
	) => ChatMessage,
	setState: IUpdater,
	createUserMessage: (
		message: string,
		userId: string,
		username?: string
	) => ChatMessage
) => ChatbotActionProvider;

export interface WidgetDefinition {
	widget: (props: Record<string, unknown>) => HTMLElement;
	props?: Record<string, unknown>;
	mapStateToProps?: string[];
}

export type Tab = "home" | "conversations" | "chats" | "help" | "updates";
export type View = {
	header: HTMLElement;
	content: HTMLElement;
};
export interface BotState {
	[key: string]: unknown;
	botName: string;
	/**
	 * The messages
	 */
	messages: ChatMessage[];
	/**
	 * Is the Bot Widget is open
	 */
	isOpen: boolean;
	/**
	 * The active tab
	 */
	activeTab: Tab;
	/**
	 * Is the Chatbot Elevated to Team
	 */
	isElevated: boolean;
}
