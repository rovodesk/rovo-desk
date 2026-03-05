import type { Block, WidgetConfig } from "@zero-heads-lab/shared/types";
import type { Message } from "../core/message-parser";

export type NewState<T extends BotState> =
	| Partial<T>
	| ((state: T) => Partial<T>);

export type StateUpdater<T extends BotState> = (updater: NewState<T>) => void;

export type StateListener<T extends BotState> = (state: T) => void;

export type StateSubscriber<T extends BotState> = (
	listener: StateListener<T>
) => () => void;

type BlockIdentity = Pick<Block, "id" | "type">;

export interface User {
	id: string;
	email: string;
	name?: string;
	[key: string]: unknown;
}

export type Mode = "visitor" | "user";

export interface BotState {
	[key: string]: unknown;

	mode: Mode;
	/**
	 * Is the Bot Widget is open
	 */
	isOpen: boolean;
	/**
	 * The messages
	 */
	messages?: Message[];

	user?: User;

	/**
	 * The active view
	 */
	activeScreen?: {
		visitors: BlockIdentity[];
		users: BlockIdentity[];
	};

	config?: WidgetConfig;
}
