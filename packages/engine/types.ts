import type { Message } from "./core/message-parser";

export type IUpdater<T extends BotState> = (
	updater: Partial<T> | ((state: T) => T)
) => void;

export type View = {
	header: HTMLElement;
	content: HTMLElement;
};

export type Tab = "home" | "conversations" | "chats" | "help" | "updates";

export interface BotState {
	[key: string]: unknown;
	/**
	 * The messages
	 */
	messages: Message[];
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
