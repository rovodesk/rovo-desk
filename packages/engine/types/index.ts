import type { canvasSchema } from "validations/canvas";
import type z from "zod";
import type { Message } from "../core/message-parser";

export type NewState<T extends BotState> =
	| Partial<T>
	| ((state: T) => Partial<T>);

export type StateUpdater<T extends BotState> = (updater: NewState<T>) => void;

export type StateListener<T extends BotState> = (state: T) => void;

export type StateSubscriber<T extends BotState> = (
	listener: StateListener<T>
) => () => void;

export type Canvas = z.infer<typeof canvasSchema>["canvas"];
export type Theme = Canvas["theme"];
export type View = Canvas["views"][number];
export type CanvasComponent = Canvas["views"][number]["components"][number];

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
	 * Is the Chatbot Elevated to Team
	 */
	isElevated: boolean;
	/**
	 * The active view
	 */
	activeViewId?: string;
	canvas?: Canvas;
	/**
	 * The API base URL
	 */
	apiBaseUrl?: string;
}
