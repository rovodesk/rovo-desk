import type { BotState } from "../types";
import { ActionProvider } from "./action-provider.js";
import { MessageParser } from "./message-parser.js";
import { initialStore, type Store } from "./state-manager.js";
import { type Widget, WidgetRegistry } from "./widget-registry.js";

export interface ChatbotEngineOptions<T extends BotState> {
	initialState: T;
	widgets?: Widget[];
}

export class ChatbotEngine<T extends BotState> {
	private readonly store: Store<T>;
	private readonly actionProvider: ActionProvider<T>;
	private readonly parser: MessageParser;
	private readonly widgetRegistry: WidgetRegistry<T>;

	constructor(options: ChatbotEngineOptions<T>) {
		const { initialState, widgets } = options;

		// 1️⃣ Create Store
		this.store = initialStore<T>(initialState);

		// 2️⃣ Create Action Provider
		this.actionProvider = new ActionProvider(this.store.setState);

		// 3️⃣ Create Parser
		this.parser = new MessageParser(this.actionProvider);

		// 4️⃣ Create Widget Registry
		this.widgetRegistry = new WidgetRegistry({
			setStateFunc: this.store.setState,
			actionProvider: this.actionProvider,
		});

		// 5️⃣ Register Initial Widgets
		widgets?.forEach((widget) => {
			this.widgetRegistry.addWidget(widget);
		});
	}

	/* --------------------------
       Public API
    -------------------------- */

	getState = () => this.store.getState();
	setState = (updater: Partial<T> | ((state: T) => T)) =>
		this.store.setState(updater);

	subscribe = (listener: (state: T) => void) => this.store.subscribe(listener);

	async handleUserMessage(message: string, options?: Record<string, unknown>) {
		// Add user message
		this.actionProvider.addUserMessage(message, options);

		// Parse message (can be async later)
		await this.parser.parse(message);
	}

	addWidget(widget: Widget) {
		this.widgetRegistry.addWidget(widget);
	}

	getWidget(widgetName: string) {
		return this.widgetRegistry.getWidget(widgetName, this.store.getState());
	}

	clearMessages() {
		this.store.setState((state) => ({
			...state,
			messages: [],
		}));
	}
}
