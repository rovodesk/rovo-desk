import type { Message } from "@zero-heads-lab/shared/lib/types";
import type { StateUpdater, WidgetState } from "../types";

export type MessageType =
	| "ai"
	| "user"
	| "visitor"
	| "admin"
	| "system"
	| "error";

export interface IMessageParser {
	parse(message: string): void;

	addAIMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	): void;

	addUserMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	): void;

	addVisitorMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "message">>
	): void;

	addAdminMessage(
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

export class MessageParser<T extends WidgetState> implements IMessageParser {
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
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	): Message {
		return {
			id: crypto.randomUUID(),
			text: message,
			type,
			createdAt: new Date().toISOString(),
			...options,
		} as Message;
	}

	addAIMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	) {
		const msg = this.createMessage(message, "ai", {
			loading: true,
			...options,
		});

		this.pushMessage(msg);
	}

	addUserMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	) {
		const msg = this.createMessage(message, "user", options);
		this.pushMessage(msg);
	}

	addAdminMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	) {
		const msg = this.createMessage(message, "admin", options);
		this.pushMessage(msg);
	}

	addVisitorMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	) {
		const msg = this.createMessage(message, "visitor", options);
		this.pushMessage(msg);
	}

	addSystemMessage(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	) {
		const msg = this.createMessage(message, "system", options);
		this.pushMessage(msg);
	}

	addError(
		message: string,
		options?: Partial<Omit<Message, "id" | "type" | "text">>
	) {
		const msg = this.createMessage(message, "error", options);
		this.pushMessage(msg);
	}

	setLoading(id: string, loading: boolean) {
		this.setState((state) => ({
			...state,
			chat: {
				...state.chat,
				messages: state.chat?.messages?.map((m) =>
					m.id === id ? { ...m, loading } : m
				),
			},
		}));
	}

	private pushMessage(message: Message) {
		this.setState((state) => {
			const messages = [...(state.chat?.messages ?? []), message];
			return {
				...state,
				chat: {
					...state.chat,
					messages,
				},
			} as T;
		});
	}
}
