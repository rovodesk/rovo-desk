import type {
	BotState,
	NewState,
	StateListener,
	StateSubscriber,
} from "../types";
import { ActionProvider } from "./action-provider.js";
import { MessageParser } from "./message-parser.js";
import { initialStore, type Store } from "./state-manager.js";
import { type Widget, WidgetRegistry } from "./widget-registry.js";

export interface ChatbotEngineOptions<T extends BotState> {
	initialState: T;
	widgets?: Widget<T>[];
}

interface IChatbotEngine<T extends BotState> {
	getState: () => T;
	updateState: (updater: NewState<T>) => void;
	subscribe: StateSubscriber<T>;

	handleUserMessage(message: string, options?: Record<string, unknown>): void;
	clearMessages(): void;

	addWidget(widget: Widget<T>): void;
	setCanvas(canvas: T["canvas"]): void;
	renderCanvas(state: T): HTMLElement | undefined;
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

	/* --------------------------
       Public API
    -------------------------- */

	getState = () => this.store.getState();

	updateState = (updater: NewState<T>) => this.store.setState(updater);

	subscribe = (listener: StateListener<T>) => this.store.subscribe(listener);

	handleUserMessage(message: string, options?: Record<string, unknown>) {
		// Add user message
		this.actionProvider.addUserMessage(message, options);

		// Parse message (can be async later)
		this.parser.parse(message);
	}

	addWidget(widget: Widget<T>) {
		this.widgetRegistry.addWidget(widget);
	}

	setCanvas(canvas: T["canvas"]) {
		const firstViewId = canvas?.views[0]?.id;

		this.store.setState({
			canvas,
			activeViewId: firstViewId,
		} as Partial<T>);
	}

	renderCanvas(state: T) {
		const container = document.createElement("div");
		container.className = "zh-canvas";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.gap = "12px";
		container.style.padding = "16px";
		container.style.overflowY = "auto";
		container.style.flex = "1";

		if (!state.canvas) return container;

		const currentView =
			state.canvas.views.find((v) => v.id === state.activeViewId) ??
			state.canvas.views[0];

		if (!currentView) return container;

		currentView.components.forEach((component) => {
			const el = this.widgetRegistry.renderComponent(component, state);
			if (el) container.appendChild(el);
		});

		return container;
	}

	clearMessages() {
		this.store.setState((state) => ({
			...state,
			messages: [],
		}));
	}
}
