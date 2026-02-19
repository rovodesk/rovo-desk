import type { ChatMessage, MessageType } from "@zero-heads-lab/shared/types";
import { generateUUID } from "@zero-heads-lab/shared/utils";
import type {
	BotState,
	ChatbotConfig,
	MessageParserConstructor,
	WidgetConfig,
} from "./types";

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
		id: generateUUID(),
		timestamp: Date.now(),
	};
};

export const createBotMessage = (
	message: string,
	options?: Partial<
		Omit<ChatMessage, "id" | "type" | "message" | "userId" | "username">
	>
): ChatMessage => {
	return {
		...createChatMessage(message, "bot"),
		...options,
		loading: true,
	};
};

export const createUserMessage = (
	message: string,
	userId: string,
	username?: string
): ChatMessage => {
	return {
		...createChatMessage(message, "user"),
		userId,
		username,
	};
};

export const getObject = (object: unknown): Record<string, unknown> | null => {
	if (object && typeof object === "object") {
		return object as Record<string, unknown>;
	}
	return null;
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

/**
 * Execute a callback function when the DOM is ready.
 * This function will only execute the callback once when the DOM is ready.
 * @param callback Callback function to execute
 */
export function onDomReady(callback: () => void) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", callback, { once: true });
	} else {
		callback();
	}
}

export function getTabTitle(tab: BotState["activeTab"]) {
	switch (tab) {
		case "home":
			return "Home";
		case "conversations":
			return "Conversations";
		case "chats":
			return "Chats";
		case "help":
			return "Help";
		case "updates":
			return "Updates";
		default:
			return "";
	}
}
