import type {
	ChatbotConfig,
	ChatMessage,
	MessageParserConstructor,
	MessageType,
	WidgetConfig,
} from "./types";

export const uniqueId = () => crypto.randomUUID();

export const botMessage = (message: ChatMessage): boolean => {
	return message.type === "bot";
};

export const createChatMessage = (
	message: string,
	type: MessageType
): ChatMessage => {
	return {
		message,
		type,
		id: uniqueId(),
	};
};

export const createBotMessage = (
	message: string,
	options?: Partial<Omit<ChatMessage, "id" | "type" | "message">>
): ChatMessage => {
	return {
		...createChatMessage(message, "bot"),
		...options,
		loading: true,
	};
};

export const createUserMessage = (message: string): ChatMessage => {
	return createChatMessage(message, "user");
};

export const createClientMessage = (message: string): ChatMessage => {
	return createChatMessage(message, "external");
};

// biome-ignore lint/suspicious/noExplicitAny: Dont know
export const callIfExists = <T extends (...args: any[]) => any>(
	func: T | undefined,
	...args: Parameters<T>
): ReturnType<T> | undefined => {
	if (func) {
		return func(...args);
	}
};

export const getObject = (object: unknown): Record<string, unknown> => {
	if (object && typeof object === "object") {
		return object as Record<string, unknown>;
	}
	return {};
};

export const getWidgets = (config: ChatbotConfig): WidgetConfig[] => {
	return config.widgets ?? [];
};

export const scrollIntoView = (): void => {
	const chatContainer = document.querySelector<HTMLElement>(
		".zero-heads-chatbot-chat-message-container"
	);

	if (!chatContainer) return;

	chatContainer.scrollTop = chatContainer.scrollHeight;
};

export const validateProps = (
	config: ChatbotConfig,
	MessageParser: MessageParserConstructor
) => {
	const errors: Error[] = [];

	if (!config.initialMessages) {
		errors.push(
			new Error(
				"Config must contain property 'initialMessages', and it expects it to be an array of chatbotmessages."
			)
		);
	}

	if (!MessageParser) {
		errors.push(
			new Error(
				"Messageparser must implement the method 'parse', please add this method to your object. The signature is parse(message: string)."
			)
		);
	}

	return errors;
};
