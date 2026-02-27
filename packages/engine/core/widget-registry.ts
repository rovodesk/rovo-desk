import type { BotState, IUpdater } from "../types";
import { getObject, scrollIntoView } from "../utils";
import type { IActionProvider } from "./action-provider.js";

interface Widget {
	widgetName: string;
	element: (props: Record<string, unknown>) => HTMLElement;
	props?: Record<string, unknown>;
	mapStateToProps?: string[];
}

interface IWidgetRegistry {
	addWidget(params: Widget): void;
	getWidget(widgetName: string, state: BotState): HTMLElement | undefined;
}

class WidgetRegistry<T extends BotState> implements IWidgetRegistry {
	private readonly setState: IUpdater<T>;
	private readonly actionProvider: IActionProvider;
	private readonly widgets: Record<string, Widget> = {};

	constructor({
		setStateFunc,
		actionProvider,
	}: {
		setStateFunc: IUpdater<T>;
		actionProvider: IActionProvider;
	}) {
		this.setState = setStateFunc;
		this.actionProvider = actionProvider;
	}

	addWidget({ widgetName, element, mapStateToProps, props }: Widget): void {
		this.widgets[widgetName] = {
			widgetName,
			element,
			props,
			mapStateToProps,
		};
	}

	getWidget(widgetName: string, state: BotState): HTMLElement | undefined {
		const widgetObject = this.widgets[widgetName];
		if (!widgetObject) return;

		const mappedStateProps = this.mapStateToProps(
			widgetObject.mapStateToProps,
			state
		);

		const widgetProps = {
			scrollIntoView,
			...getObject(widgetObject.props ?? {}),
			...mappedStateProps,
			setState: this.setState,
			actionProvider: this.actionProvider,
		};

		return widgetObject.element(widgetProps);
	}

	private mapStateToProps(
		props: string[] | undefined,
		state: BotState
	): Record<string, unknown> {
		if (!props || props.length === 0) return {};

		return props.reduce<Record<string, unknown>>((acc, prop) => {
			acc[prop] = state[prop];
			return acc;
		}, {});
	}
}

export { type Widget, type IWidgetRegistry, WidgetRegistry };
