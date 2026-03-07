import type { WidgetTabType } from "@zero-heads-lab/shared/types";
import type { BotState, CommandArgs, StateListener } from "../types";
import { ActionProvider, type IActionProvider } from "./action-provider.js";
import {
	type Component,
	ComponentRegistry,
	type IComponentRegistry,
} from "./component-registry.js";
import { MessageParser } from "./message-parser.js";
import { initialStore, type Store } from "./store.js";

export interface ChatbotEngineOptions<T extends BotState> {
	initialState: T;
	components?: Component[];
}

interface IChatbotEngine<T extends BotState> {
	dispatch(command: CommandArgs): void;

	getState(): T;

	subscribe(listener: StateListener<T>): () => void;

	changeTab(tab: WidgetTabType): void;
}

export class ChatbotEngine<T extends BotState> implements IChatbotEngine<T> {
	private readonly store: Store<T>;
	private readonly actionProvider: IActionProvider;
	readonly componentRegistry: IComponentRegistry;
	private readonly messageParser: MessageParser<T>;

	constructor(options: ChatbotEngineOptions<T>) {
		const { initialState, components } = options;

		this.store = initialStore<T>(initialState);
		this.messageParser = new MessageParser<T>(this.store.setState);

		this.actionProvider = new ActionProvider(this.store, this.messageParser);

		this.componentRegistry = new ComponentRegistry({
			actionProvider: this.actionProvider,
		});

		// Register block components
		components?.forEach((component) => {
			this.componentRegistry.addBlock(component);
		});
	}

	async dispatch([command, payload]: CommandArgs) {
		switch (command) {
			case "init":
				await this.actionProvider.init(payload);
				break;

			case "open":
				this.actionProvider.open();
				break;

			case "close":
				this.actionProvider.close();
				break;

			case "identify":
				await this.actionProvider.identify(payload);
				break;

			case "track":
				this.actionProvider.track(payload.event, payload.data);
				break;

			case "update":
				this.actionProvider.update(payload);
				break;

			case "switch-tab":
				this.actionProvider.navigate(payload);
				break;

			case "shutdown":
				this.actionProvider.shutdown();
				break;
			default:
				throw new Error(`Invalid command: ${command}`);
		}
	}

	getState(): T {
		return this.store.getState();
	}

	subscribe(listener: StateListener<T>): () => void {
		return this.store.subscribe(listener);
	}

	changeTab(tab: WidgetTabType): void {
		this.actionProvider.navigate(tab);
	}
}
