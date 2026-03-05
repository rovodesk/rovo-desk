import type { Block } from "@zero-heads-lab/shared/types";
import type { BotState, StateUpdater } from "../types";
import { scrollIntoView } from "../utils";
import type { IActionProvider } from "./action-provider.js";

export interface Widget<T extends BotState, B extends Block = Block> {
	type: B["type"];
	render: (params: {
		block: B;
		state: T;
		setState: StateUpdater<T>;
		actionProvider: IActionProvider;
		scrollIntoView: typeof scrollIntoView;
	}) => HTMLElement;
}

export interface IWidgetRegistry<T extends BotState> {
	addWidget(widget: Widget<T>): void;
	renderBlock(block: Block, state: T): HTMLElement | undefined;
}

export class WidgetRegistry<T extends BotState> implements IWidgetRegistry<T> {
	private readonly setState: StateUpdater<T>;
	private readonly actionProvider: IActionProvider;

	private readonly widgets: Record<Block["type"], Widget<T> | undefined> = {
		welcome: undefined,
		conversation: undefined,
		knowledge_base: undefined,
		announcement: undefined,
		cta: undefined,
	};

	constructor({
		setStateFunc,
		actionProvider,
	}: {
		setStateFunc: StateUpdater<T>;
		actionProvider: IActionProvider;
	}) {
		this.setState = setStateFunc;
		this.actionProvider = actionProvider;
	}

	addWidget(widget: Widget<T>): void {
		this.widgets[widget.type] = widget;
	}

	renderBlock(block: Block, state: T): HTMLElement | undefined {
		const widget = this.widgets[block.type];
		if (!(widget && block.enabled)) return;

		return widget.render({
			block,
			state,
			setState: this.setState,
			actionProvider: this.actionProvider,
			scrollIntoView,
		});
	}
}
