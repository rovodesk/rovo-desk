import type { BotState, StateUpdater } from "../types";
import { createChatMessage, type Message } from "./message-parser.js";

interface IActionProvider {
	addAIMessage: (
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

	addSystemMessage: (
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) => void;

	addError: (
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) => void;

	setLoading(id: string, loading: boolean): void;
}

class ActionProvider<T extends BotState> implements IActionProvider {
	private readonly setState: StateUpdater<T>;

	constructor(setState: StateUpdater<T>) {
		this.setState = setState;
	}

	addAIMessage(
		message: string,
		options?: Partial<
			Omit<Message, "id" | "type" | "message" | "userId" | "username">
		>
	) {
		const aiMessage = {
			...createChatMessage(message, "ai"),
			...options,
			loading: true,
		};

		this.setState((state) => ({
			...state,
			messages: [...(state.messages || []), aiMessage],
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
			messages: [...(state.messages || []), userMessage],
		}));
	}

	addSystemMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) {
		const systemMessage = {
			...createChatMessage(message, "system"),
			...options,
		};

		this.setState((state) => ({
			...state,
			messages: [...(state.messages || []), systemMessage],
		}));
	}

	addError(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) {
		const errorMessage = {
			...createChatMessage(message, "error"),
			...options,
		};

		this.setState((state) => ({
			...state,
			messages: [...(state.messages || []), errorMessage],
		}));
	}

	setLoading(id: string, loading: boolean) {
		this.setState((state) => ({
			...state,
			messages: (state.messages || []).map((message) =>
				message.id === id ? { ...message, loading } : message
			),
		}));
	}
}

export { type IActionProvider, ActionProvider };
