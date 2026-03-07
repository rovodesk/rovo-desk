import type { WidgetConfig, WidgetTabType } from "@zero-heads-lab/shared/types";
import type { SDKConfig } from "config";
import type { Message } from "../core/message-parser";

export type NewState<T extends BotState> =
	| Partial<T>
	| ((state: T) => Partial<T>);

export type StateUpdater<T extends BotState> = (updater: NewState<T>) => void;

export type StateListener<T extends BotState> = (
	state: T,
	prevState: T
) => void;

export type StateSubscriber<T extends BotState> = (
	listener: StateListener<T>
) => () => void;

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
	messages: Message[];

	user?: User;

	activeTab?: WidgetTabType;
	widgetConfig?: WidgetConfig;
	sdkConfig?: SDKConfig;
}

export type Command =
	| { type: "init"; payload: SDKConfig }
	| { type: "open" }
	| { type: "close" }
	| { type: "identify"; payload: User }
	| { type: "track"; payload: { event: string; data?: unknown } }
	| { type: "update"; payload: Partial<SDKConfig> }
	| { type: "switch-tab"; payload: WidgetTabType }
	| { type: "shutdown" };

export type CommandArgs =
	| ["init", SDKConfig]
	| ["open"]
	| ["close"]
	| ["identify", User]
	| ["track", { event: string; data?: unknown }]
	| ["update", Partial<SDKConfig>]
	| ["switch-tab", WidgetTabType]
	| ["shutdown"];

export type RovoDeskFunction = (...args: CommandArgs) => void;
