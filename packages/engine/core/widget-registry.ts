import type { BotState, CanvasComponent, StateUpdater } from "../types";
import { scrollIntoView } from "../utils";
import type { IActionProvider } from "./action-provider.js";

export interface Widget<
	T extends BotState,
	C extends CanvasComponent = CanvasComponent,
> {
	type: C["type"];
	render: (params: {
		component: C;
		state: T;
		setState: StateUpdater<T>;
		actionProvider: IActionProvider;
		scrollIntoView: typeof scrollIntoView;
	}) => HTMLElement;
}

export interface IWidgetRegistry<
	T extends BotState,
	C extends CanvasComponent = CanvasComponent,
> {
	addWidget(widget: Widget<T, C>): void;
	renderComponent(
		component: CanvasComponent,
		state: T
	): HTMLElement | undefined;
}

export class WidgetRegistry<T extends BotState> implements IWidgetRegistry<T> {
	private readonly setState: StateUpdater<T>;
	private readonly actionProvider: IActionProvider;

	private readonly widgets: Record<
		CanvasComponent["type"],
		// biome-ignore lint/suspicious/noExplicitAny: It can be of any type
		Widget<T, any> | undefined
	> = {
		text: undefined,
		textarea: undefined,
		image: undefined,
		"single-select": undefined,
		"multi-select": undefined,
		button: undefined,
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

	addWidget<C extends CanvasComponent>(widget: Widget<T, C>): void {
		this.widgets[widget.type] = widget;
	}

	renderComponent(
		component: CanvasComponent,
		state: T
	): HTMLElement | undefined {
		const widget = this.widgets[component.type];
		if (!widget) return;

		return widget.render({
			component,
			state,
			setState: this.setState,
			actionProvider: this.actionProvider,
			scrollIntoView,
		});
	}
}
