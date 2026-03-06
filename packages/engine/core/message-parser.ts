import type { BotState, StateUpdater } from "../types";

export type MessageType =
	| "ai"
	| "visitor"
	| "user"
	| "admin"
	| "system"
	| "error";

export interface Message {
	id: string;
	userId?: string;
	username?: string;
	message: string;
	timestamp: number;
	type: MessageType;
	loading?: boolean;
	widget?: string;
}

export interface IMessageParser {
	parse(message: string): void;

	addAIMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	): void;

	addUserMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	): void;

	addSystemMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	): void;

	addError(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	): void;

	setLoading(id: string, loading: boolean): void;
}

export class MessageParser<T extends BotState> implements IMessageParser {
	private readonly setState: StateUpdater<T>;

	constructor(setState: StateUpdater<T>) {
		this.setState = setState;
	}

	/*
	Message Router
	*/
	parse(message: string) {
		const normalized = message.toLowerCase();

		if (normalized.includes("hello")) {
			this.addSystemMessage("Hello 👋 I am working!");
			return;
		}

		this.addError("Sorry, I didn’t understand that.");
	}

	/*
	Message Creators
	*/
	private createMessage(
		message: string,
		type: MessageType,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	): Message {
		return {
			id: crypto.randomUUID(),
			message,
			type,
			timestamp: Date.now(),
			...options,
		};
	}

	addAIMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) {
		const msg = this.createMessage(message, "ai", {
			loading: true,
			...options,
		});

		this.pushMessage(msg);
	}

	addUserMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) {
		const msg = this.createMessage(message, "user", options);
		this.pushMessage(msg);
	}

	addSystemMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) {
		const msg = this.createMessage(message, "system", options);
		this.pushMessage(msg);
	}

	addError(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	) {
		const msg = this.createMessage(message, "error", options);
		this.pushMessage(msg);
	}

	setLoading(id: string, loading: boolean) {
		this.setState((state) => ({
			...state,
			messages: state.messages.map((m) =>
				m.id === id ? { ...m, loading } : m
			),
		}));
	}

	private pushMessage(message: Message) {
		this.setState((state) => ({
			...state,
			messages: [...state.messages, message],
		}));
	}
}
