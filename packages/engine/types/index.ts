import type {
	Message,
	WidgetConfig,
	WidgetTabType,
} from "@zero-heads-lab/shared/lib/types";
import type { SDKConfigSchema } from "@zero-heads-lab/shared/lib/validations/widget";
import type { z } from "zod";

export type SDKConfig = z.infer<typeof SDKConfigSchema>;

/**
 * The User available to the widget
 */
export interface User {
	id: string;
	email?: string;
	name?: string;
	[key: string]: unknown;
}

/**
 * The Mode of the widget
 */
export type Mode = "visitor" | "user";

export interface Route {
	name: string;
	params?: Record<string, unknown>;
}

/**
 * The Widget State
 */
export interface WidgetState {
	ui: {
		isOpen: boolean;
		isInitialized: boolean;
		activeTab: WidgetTabType;
		routes: Route[];
	};

	session: {
		mode: "visitor" | "user";
		token?: string;
		user?: User;
		sessionId?: string;
	};

	chat: {
		messages: Message[];
	};

	config: {
		widget: WidgetConfig;
		sdk: SDKConfig;
	};
}

export type WidgetAction =
	| { type: "INIT"; payload: SDKConfig }
	| { type: "OPEN" }
	| { type: "CLOSE" }
	| { type: "IDENTIFY"; payload: User }
	| { type: "SWITCH_TAB"; payload: WidgetTabType }
	| { type: "ADD_MESSAGE"; payload: Message }
	| { type: "SET_MESSAGES"; payload: Message[] }
	| { type: "UPDATE_CONFIG"; payload: Partial<SDKConfig> }
	| { type: "SHUTDOWN" };

/**
 * The State Updater
 */
export type StateUpdater<T extends WidgetState> = (
	updater: NewState<T>
) => void;

/**
 * The State Listener
 */
export type StateListener<T extends WidgetState> = (
	state: T,
	prevState: T
) => void;

/**
 * The State Subscriber
 */
export type StateSubscriber<T extends WidgetState> = (
	listener: StateListener<T>
) => () => void;

/**
 * The New State
 */
export type NewState<T extends WidgetState> =
	| Partial<T>
	| ((state: T) => Partial<T>);
