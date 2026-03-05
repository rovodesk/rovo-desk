import type { IActionProvider } from "./action-provider.js";

type MessageType = "ai" | "visitor" | "user" | "admin" | "system" | "error";

interface Message {
	id: string;
	userId?: string;
	username?: string;
	message: string;
	timestamp?: number;
	type: MessageType;
	loading?: boolean;
	widget?: string;
}

interface IMessageParser {
	parse(message: string): void;
}

class MessageParser implements IMessageParser {
	private readonly actionProvider: IActionProvider;

	constructor(actionProvider: IActionProvider) {
		this.actionProvider = actionProvider;
	}

	parse(message: string) {
		if (message.toLowerCase().includes("hello")) {
			this.actionProvider.addSystemMessage("Hello 👋 I am working!");
			return;
		}
		// fallback
		this.actionProvider.addError("Sorry, I didn’t understand that.");
	}
}

const createChatMessage = (message: string, type: MessageType): Message => {
	return {
		message,
		type,
		id: crypto.randomUUID(),
		timestamp: Date.now(),
	};
};

export {
	MessageParser,
	type IMessageParser,
	type MessageType,
	type Message,
	createChatMessage,
};
