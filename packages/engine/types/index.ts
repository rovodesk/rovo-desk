import type { WidgetConfig, WidgetTabType } from "@zero-heads-lab/shared/types";
import type { SDKConfigSchema } from "config";
import type z from "zod";
import type { Message } from "../core/message-parser";

export interface User {
	id: string;
	email: string;
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
	[key: string]: unknown; // for custom state

	/** Bot Mode to switch between visitor and identified user */
	mode: Mode;
	/**
	 * Is the Bot Widget is open
	 */
	isOpen: boolean;
	/**
	 * Is the Bot Widget is initialized
	 */
	isInitialized: boolean;
	/**
	 * The messages corresponding to the current conversation
	 */
	messages?: Message[];
	/**
	 * The user
	 */
	user?: User;
	/**
	 * The active tab
	 */
	activeTab?: WidgetTabType;
	/**
	 * Navigation route stack for SPA routing
	 */
	routes?: Route[];
	/**
	 * The widget config
	 */
	widgetConfig?: WidgetConfig;
	/**
	 * The SDK config
	 */
	sdkConfig?: SDKConfig;
}

/**
 * The Commands available to the widget
 */
export type Command =
	| { type: "init"; payload: SDKConfig }
	| { type: "open" }
	| { type: "close" }
	| { type: "identify"; payload: User }
	| { type: "track"; payload: { event: string; data?: unknown } }
	| { type: "update"; payload: Partial<SDKConfig> }
	| { type: "switch-tab"; payload: WidgetTabType }
	| { type: "push-route"; payload: Route }
	| { type: "pop-route" }
	| { type: "shutdown" };

/**
 * The Command Arguments corresponding to the Command
 */
export type CommandArgs =
	| ["init", SDKConfig]
	| ["open"]
	| ["close"]
	| ["identify", User]
	| ["track", { event: string; data?: unknown }]
	| ["update", Partial<SDKConfig>]
	| ["switch-tab", WidgetTabType]
	| ["push-route", Route]
	| ["pop-route"]
	| ["shutdown"];

/**
 * The Widget Function to be exposed to the window object
 */
export type RovoDeskFunction = (...args: CommandArgs) => void;

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

export type SDKConfig = z.infer<typeof SDKConfigSchema>;
