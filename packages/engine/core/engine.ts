import type { Block, WidgetConfig } from "@zero-heads-lab/shared/types";
import type { BotState, Mode, NewState, StateListener, User } from "../types";
import { ActionProvider } from "./action-provider.js";
import { MessageParser } from "./message-parser.js";
import { initialStore, type Store } from "./state-manager.js";
import { type Widget, WidgetRegistry } from "./widget-registry.js";

export interface ChatbotEngineOptions<T extends BotState> {
	initialState: T;
	widgets?: Widget<T>[];
}

interface IChatbotEngine<T extends BotState> {
	handleUserMessage(message: string, options?: Record<string, unknown>): void;
	clearMessages(): void;

	getState(): T;
	subscribe(listener: StateListener<T>): () => void;

	updateState(updater: NewState<T>): void;

	setUser(user: User): void;
	setConfig(config: WidgetConfig): void;
	setMode(mode: Mode): void;
	getMode(): Mode;

	renderBlock(block: Block, state: T): HTMLElement | undefined;
	renderScreen(state: T): HTMLElement | undefined;
}

export class ChatbotEngine<T extends BotState> implements IChatbotEngine<T> {
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

	getState(): T {
		return this.store.getState();
	}

	subscribe(listener: StateListener<T>): () => void {
		return this.store.subscribe(listener);
	}

	updateState(updater: NewState<T>): void {
		this.store.setState(updater);
	}

	handleUserMessage(message: string, options?: Record<string, unknown>) {
		// Add user message
		this.actionProvider.addUserMessage(message, options);

		// Parse message (can be async later)
		this.parser.parse(message);
	}

	setUser(user: User) {
		this.store.setState((state) => ({
			...state,
			user,
		}));
	}

	setConfig(config: WidgetConfig) {
		this.store.setState((state) => ({
			...state,
			config,
		}));
	}

	setMode(mode: Mode) {
		this.store.setState((state) => ({
			...state,
			mode,
		}));
	}

	getMode(): Mode {
		return this.store.getState().mode;
	}

	renderScreen(state: T) {
		const container = document.createElement("div");
		container.className = `zh-${state.mode}-screen`;
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.gap = "12px";
		container.style.padding = "16px";
		container.style.overflowY = "auto";
		container.style.flex = "1";

		if (!state.config) return container;

		let currentScreen: Block[];
		if (state.mode === "visitor") {
			currentScreen = state.config.screens.visitors;
		} else {
			currentScreen = state.config.screens.users;
		}

		if (!currentScreen) return container;

		currentScreen.forEach((block) => {
			const blockEl = this.widgetRegistry.renderBlock(block, state);
			if (blockEl) container.appendChild(blockEl);
		});

		return container;
	}

	renderBlock(block: Block, state: T): HTMLElement | undefined {
		if (!block.enabled) return;

		return this.widgetRegistry.renderBlock(block, state);
	}

	clearMessages() {
		this.store.setState((state) => ({
			...state,
			messages: [],
		}));
	}
}
