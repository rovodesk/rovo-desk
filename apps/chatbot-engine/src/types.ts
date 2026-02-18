export type MessageType = "bot" | "user" | "external";

export interface ChatMessage {
	id: string;
	message: string;
	type: MessageType;
	loading?: boolean;
	widget?: string;
}

export interface IMessageParser {
	parse(message: string): void;
}

export type MessageParserConstructor = new (
	actionProvider: ChatbotActionProvider
) => IMessageParser;

export type IUpdater = (
	updater: Partial<ChatState> | ((state: ChatState) => ChatState)
) => void;

export interface ChatbotActionProvider {
	createBotMessage: (
		message: string,
		options?: Record<string, unknown>
	) => ChatMessage;
	createClientMessage: (message: string) => ChatMessage;
	createUserMessage: (message: string) => ChatMessage;
	stateUpdater: IUpdater;
}

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

export type ActionProviderConstructor = new (
	createBotMessage: (
		message: string,
		options?: Record<string, unknown>
	) => ChatMessage,
	setState: IUpdater,
	createUserMessage: (message: string) => ChatMessage,
	createClientMessage: (message: string) => ChatMessage
) => ChatbotActionProvider;

export interface WidgetDefinition {
	widget: (props: Record<string, unknown>) => HTMLElement;
	props?: Record<string, unknown>;
	mapStateToProps?: string[];
}

export interface ChatState {
	messages: ChatMessage[];
	[key: string]: unknown;
}
