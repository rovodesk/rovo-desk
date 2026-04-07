/** biome-ignore-all lint/suspicious/useAwait: No awaited functions are used here*/

import { WIDGET_INIT_RESPONSE } from "@zero-heads-lab/shared/contracts/api/widget";
import type { Message, WidgetTabType } from "@zero-heads-lab/shared/lib/types";
import { SDKConfigSchema } from "@zero-heads-lab/shared/lib/validations/widget";
import type { SDKConfig, User, WidgetState } from "../types";
import { MessageParser } from "./message-parser";
import type { Store } from "./store";

interface IActionProvider {
	/**
	 * Initialize the widget
	 * @param {SDKConfig} config
	 */
	init(config: SDKConfig): Promise<void>;
	/**
	 * Identify the user
	 * @param {User} user
	 */
	identify(user: User): Promise<string>;

	/**
	 * Open the widget
	 */
	open(): void;
	/**
	 * Close the widget
	 */
	close(): void;

	/**
	 * Track an event with any data
	 * @param {string} event
	 * @param {unknown} data
	 */
	track(event: string, data?: unknown): void;
	/**
	 * Update the widget sdk config
	 * @param {Partial<SDKConfig>} config
	 */
	updateConfig(config: Partial<SDKConfig>): void;
	/**
	 * Navigate to a tab
	 * @param {WidgetTabType} tab
	 */
	switchTab(tab: WidgetTabType): void;
	/**
	 * Shutdown the widget
	 */
	shutdown(): void;

	/**
	 * Add a message to the widget
	 * @param {Message} message
	 */
	addMessage(message: Message): void;

	/**
	 * Set messages to the widget
	 * @param {Message[]} messages
	 */
	setMessages(messages: Message[]): void;
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

class ActionProvider<T extends WidgetState> implements IActionProvider {
	private readonly store: Store<T>;
	private readonly messageParser: MessageParser<T>;
	private readonly actionQueue: Array<() => void> = [];

	constructor(store: Store<T>) {
		this.store = store;
		this.messageParser = new MessageParser(this.store.setState);
	}

	private initPromise: Promise<void> | null = null;
	private identifyPromise: Promise<string> | null = null;

	// Flush the queue of pending actions
	private flushQueue() {
		while (this.actionQueue.length > 0) {
			const action = this.actionQueue.shift();
			action?.();
		}
	}

	async init(config: SDKConfig): Promise<void> {
		if (this.initPromise) return this.initPromise;

		this.initPromise = (async () => {
			console.log("RovoDesk: init");

			try {
				// ✅ Validate config
				const validatedConfig = SDKConfigSchema.parse(config);

				// ✅ Call API (single call only)
				const res = await fetch(`${validatedConfig.apiBaseUrl}/init`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						organizationId: validatedConfig.organizationId,
						accessKey: validatedConfig.accessKey,
						user: validatedConfig.user,
					}),
				});

				if (!res.ok) {
					throw new Error(`Init failed: ${res.status}`);
				}

				const raw = await res.json();
				const data = WIDGET_INIT_RESPONSE.parse(raw);

				const widgetConfig = data.widgetConfig;
				const mode = data.mode;
				const defaultTab = widgetConfig.screens[mode].defaultTab;

				// ✅ Unified state update
				this.store.setState((state) => ({
					...state,
					ui: {
						...state.ui,
						isInitialized: true,
						activeTab: defaultTab,
					},
					// session:
					// 	mode === "visitor"
					// 		? {
					// 				mode,
					// 				sessionId: data,
					// 			}
					// 		: {
					// 				mode,
					// 				user: data.user,
					// 				token: data.token, //Short lived token
					// 			},
					config: {
						...state.config,
						sdk: validatedConfig,
						widget: widgetConfig,
					},
				}));

				console.log("RovoDesk initialized:", mode);

				this.flushQueue();
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

			const config = this.store.getState().config.sdk;
			if (!config) {
				throw new Error("SDK config not found");
			}

			try {
				const res = await fetch(`${config.apiBaseUrl}/identify`, {
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
				this.store.setState((state) => ({
					...state,
					session: {
						mode: "user",
						user,
						token, //Short lived token
					},
				}));

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
		if (!this.store.getState().ui.isInitialized) {
			console.warn("RovoDesk: queued 'open' action");
			this.actionQueue.push(() => this.open());
			return;
		}

		console.log("RovoDesk: open");

		this.store.setState((state) => ({
			...state,
			ui: {
				...state.ui,
				isOpen: true,
			},
		}));
	}

	close() {
		if (!this.store.getState().ui.isInitialized) {
			this.actionQueue.push(() => this.close());
			return;
		}

		console.log("RovoDesk: close");
		this.store.setState((state) => ({
			...state,
			ui: {
				...state.ui,
				isOpen: false,
			},
		}));
	}

	track(event: string, data?: unknown) {
		if (!this.store.getState().ui.isInitialized) {
			this.actionQueue.push(() => this.track(event, data));
			return;
		}
		console.log("Track event", event, data);
	}

	updateConfig(config: Partial<SDKConfig>) {
		if (!this.store.getState().ui.isInitialized) {
			this.actionQueue.push(() => this.updateConfig(config));
			return;
		}

		this.store.setState((state) => ({
			...state,
			config: {
				...state.config,
				sdk: {
					...(state.config.sdk ?? {}),
					...config,
				},
			},
		}));
	}

	switchTab(tab: WidgetTabType) {
		if (!this.store.getState().ui.isInitialized) {
			this.actionQueue.push(() => this.switchTab(tab));
			return;
		}

		this.store.setState((state) => ({
			...state,
			ui: {
				...state.ui,
				activeTab: tab,
			},
		}));
		this.track("navigate", { tab });
		console.log("RovoDesk: navigate", tab);
	}

	shutdown() {
		if (!this.store.getState().ui.isInitialized) {
			this.actionQueue.push(() => this.shutdown());
			return;
		}

		this.store.setState((state) => ({
			...state,
			ui: {
				...state.ui,
				isInitialized: false,
				isOpen: false,
				activeTab: "welcome",
			},
			session: {
				...state.session,
				mode: "visitor",
				user: null,
				token: null,
				sessionId: null,
			},
			chat: {
				...state.chat,
				messages: [],
			},
			config: {
				...state.config,
				widget: null,
				sdk: null,
			},
		}));
	}

	addMessage(message: Message): void {
		if (!this.store.getState().ui.isInitialized) {
			this.actionQueue.push(() => this.addMessage(message));
			return;
		}

		switch (message.type) {
			case "ai":
				this.messageParser.addAIMessage(message.text || "", message);
				break;
			case "text":
			case "user":
				this.messageParser.addUserMessage(message.text || "", message);
				break;
			case "visitor":
				this.messageParser.addVisitorMessage(message.text || "", message);
				break;
			case "admin":
				this.messageParser.addAdminMessage(message.text || "", message);
				break;
			case "system":
				this.messageParser.addSystemMessage(message.text || "", message);
				break;
			case "error":
				this.messageParser.addError(message.text || "", message);
				break;
			default:
				console.warn("Unhandled message type", message.type);
				break;
		}
	}

	setMessages(messages: Message[]): void {
		if (!this.store.getState().ui.isInitialized) {
			this.actionQueue.push(() => this.setMessages(messages));
			return;
		}

		this.store.setState((state) => ({
			...state,
			chat: {
				...state.chat,
				messages,
			},
		}));
	}
}

export { ActionProvider, type IActionProvider };
