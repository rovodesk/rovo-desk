import type { BotState, StateUpdater } from "../types";
import { createChatMessage, type Message } from "./message-parser.js";

interface IActionProvider {
	addBotMessage: (
		message: string,
		options?: Partial<
			Omit<Message, "id" | "type" | "message" | "userId" | "username">
		>
	) => void;

	addUserMessage: (
		message: string,
		options?: Partial<
			Omit<Message, "id" | "type" | "message" | "userId" | "username">
		>
	) => void;

	setLoading(id: string, loading: boolean): void;
}

class ActionProvider<T extends BotState> implements IActionProvider {
	private readonly setState: StateUpdater<T>;

	constructor(setState: StateUpdater<T>) {
		this.setState = setState;
	}

	addBotMessage(
		message: string,
		options?: Partial<
			Omit<Message, "id" | "type" | "message" | "userId" | "username">
		>
	) {
		const botMessage = {
			...createChatMessage(message, "bot"),
			...options,
			loading: true,
		};

		this.setState((state) => ({
			...state,
			messages: [...state.messages, botMessage],
		}));
	}

	addUserMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) {
		const userMessage = {
			...createChatMessage(message, "user"),
			...options,
		};

		this.setState((state) => ({
			...state,
			messages: [...state.messages, userMessage],
		}));
	}

	setLoading(id: string, loading: boolean) {
		this.setState((state) => ({
			...state,
			messages: state.messages.map((message) =>
				message.id === id ? { ...message, loading } : message
			),
		}));
	}
}

export { type IActionProvider, ActionProvider };
