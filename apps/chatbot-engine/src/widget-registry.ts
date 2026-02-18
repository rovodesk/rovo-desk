import type {
	ChatbotActionProvider,
	ChatState,
	IUpdater,
	WidgetDefinition,
} from "./types";
import { getObject, scrollIntoView } from "./utils";

export interface AddWidgetParams {
	widgetName: string;
	widgetFunc: (props: Record<string, unknown>) => HTMLElement;
	mapStateToProps?: string[];
	props?: Record<string, unknown>;
}

export interface IWidgetRegistry {
	addWidget(params: AddWidgetParams): void;
	getWidget(widgetName: string, state: ChatState): HTMLElement | undefined;
}

export class WidgetRegistry implements IWidgetRegistry {
	private readonly setState: IUpdater;

	private readonly actionProvider: ChatbotActionProvider;

	private readonly widgets: Record<string, WidgetDefinition> = {};

	constructor({
		setStateFunc,
		actionProvider,
	}: {
		setStateFunc: IUpdater;
		actionProvider: ChatbotActionProvider;
	}) {
		this.setState = setStateFunc;
		this.actionProvider = actionProvider;
	}

	addWidget({
		widgetName,
		widgetFunc,
		mapStateToProps,
		props,
	}: AddWidgetParams): void {
		this.widgets[widgetName] = {
			widget: widgetFunc,
			props,
			mapStateToProps,
		};
	}

	getWidget(widgetName: string, state: ChatState): HTMLElement | undefined {
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

		return widgetObject.widget(widgetProps);
	}

	private mapStateToProps(
		props: string[] | undefined,
		state: ChatState
	): Record<string, unknown> {
		if (!props || props.length === 0) return {};

		return props.reduce<Record<string, unknown>>((acc, prop) => {
			acc[prop] = state[prop];
			return acc;
		}, {});
	}
}

export default WidgetRegistry;
