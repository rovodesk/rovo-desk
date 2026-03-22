/** biome-ignore-all lint/suspicious/useAwait: No awaited functions are used here*/

import type { WidgetTabType } from "@zero-heads-lab/shared/types";
import type { Route, SDKConfig, User, WidgetState } from "../types";
import { type Message, MessageParser } from "./message-parser";
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
	 * Update the widget config
	 * @param {Partial<SDKConfig>} config
	 */
	update(config: Partial<SDKConfig>): void;
	/**
	 * Navigate to a tab
	 * @param {WidgetTabType} tab
	 */
	navigate(tab: WidgetTabType): void;
	/**
	 * Push a new route to the navigation stack
	 * @param {Route} route
	 */
	pushRoute(route: Route): void;
	/**
	 * Pop the current route from the navigation stack
	 */
	popRoute(): void;
	/**
	 * Shutdown the widget
	 */
	shutdown(): void;

	/**
	 * Add a message to the widget
	 * @param {Message} message
	 */
	addMessage(message: Message): void;
}

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
				// store sdk config  in state immediately
				this.store.setState((state) => ({ ...state, sdkConfig: config }));

				// If the user is provided in the config, identify the user via API
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
					isInitialized: true,
				}));

				console.log("RovoDesk: widget config", widgetConfig);
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
		if (!this.store.getState().isInitialized) {
			console.warn("RovoDesk: queued 'open' action");
			this.actionQueue.push(() => this.open());
			return;
		}

		console.log("RovoDesk: open");

		this.store.setState((state) => ({
			...state,
			isOpen: true,
		}));
	}

	close() {
		if (!this.store.getState().isInitialized) {
			this.actionQueue.push(() => this.close());
			return;
		}

		console.log("RovoDesk: close");
		this.store.setState((state) => ({
			...state,
			isOpen: false,
		}));
	}

	track(event: string, data?: unknown) {
		if (!this.store.getState().isInitialized) {
			this.actionQueue.push(() => this.track(event, data));
			return;
		}
		console.log("Track event", event, data);
	}

	update(config: Partial<SDKConfig>) {
		if (!this.store.getState().isInitialized) {
			this.actionQueue.push(() => this.update(config));
			return;
		}

		this.store.setState((state) => ({
			...state,
			sdkConfig: {
				...(state.sdkConfig ?? {}),
				...config,
			},
		}));
	}

	navigate(tab: WidgetTabType) {
		if (!this.store.getState().isInitialized) {
			this.actionQueue.push(() => this.navigate(tab));
			return;
		}

		this.store.setState((state) => ({
			...state,
			activeTab: tab,
			routes: [], // clear route stack when changing tab
		}));
		this.track("navigate", { tab });
		console.log("RovoDesk: navigate", tab);
	}

	pushRoute(route: Route) {
		if (!this.store.getState().isInitialized) {
			this.actionQueue.push(() => this.pushRoute(route));
			return;
		}

		this.store.setState((state) => ({
			...state,
			routes: [...(state.routes || []), route],
		}));
		this.track("push-route", { route });
	}

	popRoute() {
		if (!this.store.getState().isInitialized) {
			this.actionQueue.push(() => this.popRoute());
			return;
		}

		this.store.setState((state) => {
			const routes = state.routes || [];
			return {
				...state,
				routes: routes.slice(0, -1),
			};
		});
		this.track("pop-route");
	}

	shutdown() {
		if (!this.store.getState().isInitialized) {
			this.actionQueue.push(() => this.shutdown());
			return;
		}

		this.store.setState((state) => ({
			...state,
			isOpen: false,
			messages: [],
			routes: [],
		}));
	}

	addMessage(message: Message): void {
		if (!this.store.getState().isInitialized) {
			this.actionQueue.push(() => this.addMessage(message));
			return;
		}

		switch (message.type) {
			case "ai":
				this.messageParser.addAIMessage(message.message, message);
				break;
			case "user":
				this.messageParser.addUserMessage(message.message, message);
				break;
			case "visitor":
				this.messageParser.addVisitorMessage(message.message, message);
				break;
			case "admin":
				this.messageParser.addAdminMessage(message.message, message);
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

export { ActionProvider, type IActionProvider };
