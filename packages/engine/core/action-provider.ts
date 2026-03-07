/** biome-ignore-all lint/suspicious/useAwait: No awaited functions are used here*/

import type { WidgetTabType } from "@zero-heads-lab/shared/types";
import { renderLoading } from "components/loading";
import type { SDKConfig } from "config";
import { isSDKInitialized } from "utils";
import type { BotState, User } from "../types";
import type { Message, MessageParser } from "./message-parser";
import type { Store } from "./store";

interface IActionProvider {
	init(config: SDKConfig): Promise<void>;
	identify(user: User): Promise<string>;

	open(): void;
	close(): void;

	track(event: string, data?: unknown): void;
	update(data: Partial<SDKConfig>): void;
	navigate(tab: WidgetTabType): void;
	shutdown(): void;

	addMessage(message: Message): void;
}

class ActionProvider<T extends BotState & { sdkConfig?: SDKConfig }>
	implements IActionProvider {
	private readonly store: Store<T>;
	private readonly messageParser: MessageParser<T>;

	private initPromise: Promise<void> | null = null;
	private identifyPromise: Promise<string> | null = null;

	constructor(store: Store<T>, messageParser: MessageParser<T>) {
		this.store = store;
		this.messageParser = messageParser;
	}

	async init(config: SDKConfig): Promise<void> {
		if (this.initPromise) return this.initPromise;

		this.initPromise = (async () => {
			console.log("RovoDesk: init");

			try {
				// store sdk config immediately
				this.store.setState((state) => ({ ...state, sdkConfig: config }));

				let token: string | undefined;

				if (config.user) {
					token = await this.identify(config.user);
				}

				const headers: Record<string, string> = {
					"Content-Type": "application/json",
				};

				if (token) {
					headers.Authorization = `Bearer ${token}`;
				}

				const res = await fetch(`${config.apiBaseUrl}/init`, {
					method: "POST",
					headers,
					body: JSON.stringify({
						workspaceId: config.organizationId,
						user: config.user,
					}),
				});

				if (!res.ok) {
					throw new Error(`Init failed: ${res.status}`);
				}

				const data = await res.json();

				const widgetConfig = data.widgetConfig?.config ?? data.widgetConfig;
				const mode = data.mode ?? (config.user ? "user" : "visitor");

				let modeConfig = widgetConfig?.screens?.[mode];

				// Handle old schema fallback
				if (!modeConfig && widgetConfig?.screens?.screens) {
					modeConfig = widgetConfig.screens;
				}

				this.store.setState((state) => ({
					...state,
					mode,
					user: data.user,
					widgetConfig,
					activeTab: modeConfig?.defaultTab,
				}));

				console.log("RovoDesk: widget config", widgetConfig);
			} catch (err) {
				console.error("RovoDesk init failed", err);
				this.initPromise = null;
				throw err;
			}
		})();

		return this.initPromise;
	}

	async identify(user: User): Promise<string> {
		if (this.identifyPromise) return this.identifyPromise;

		if (!user) {
			throw new Error("User not provided");
		}

		this.identifyPromise = (async () => {
			console.log("RovoDesk: identify", user?.id);

			const config = this.store.getState().sdkConfig;
			if (!config) {
				throw new Error("SDK config not found");
			}

			try {
				const res = await fetch(`${config.apiBaseUrl}/auth`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						organizationId: config.organizationId,
						user: config.user,
						accessKey: config.accessKey,
					}),
				});

				if (!res.ok) {
					throw new Error(`Auth failed: ${res.status}`);
				}

				const { token } = await res.json();

				if (!token) {
					throw new Error("Auth response missing token");
				}

				// store user immediately
				this.store.setState((state) => ({ ...state, user: config.user }));

				return token;
			} catch (err) {
				console.error("RovoDesk identify failed", err);
				this.identifyPromise = null;
				throw err;
			}
		})();

		return this.identifyPromise;
	}

	open() {
		console.log("RovoDesk: open");
		if (!isSDKInitialized(this.store.getState())) {
			renderLoading();
			return;
		}
		this.store.setState((state) => ({
			...state,
			isOpen: true,
		}));
	}

	close() {
		console.log("RovoDesk: close");
		this.store.setState((state) => ({
			...state,
			isOpen: false,
		}));
	}

	track(event: string, data?: unknown) {
		console.log("Track event", event, data);
	}

	update(config: Partial<SDKConfig>) {
		this.store.setState((state) => ({
			...state,
			sdkConfig: {
				...(state.sdkConfig ?? {}),
				...config,
			},
		}));
	}

	navigate(tab: WidgetTabType) {
		this.store.setState((state) => ({
			...state,
			activeTab: tab,
		}));
		this.track("widget_tab_changed", { tab });
	}

	shutdown() {
		this.store.setState((state) => ({
			...state,
			isOpen: false,
			messages: [],
		}));
	}

	addMessage(message: Message): void {
		switch (message.type) {
			case "ai":
				this.messageParser.addAIMessage(message.message, message);
				break;
			case "user":
				this.messageParser.addUserMessage(message.message, message);
				break;
			case "system":
				this.messageParser.addSystemMessage(message.message, message);
				break;
			case "error":
				this.messageParser.addError(message.message, message);
				break;
			default:
				this.messageParser.addError("Invalid message type", message);
				break;
		}
	}
}

export { type IActionProvider, ActionProvider };
