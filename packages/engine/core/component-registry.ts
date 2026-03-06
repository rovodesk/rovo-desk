import type { AnyBlock } from "@zero-heads-lab/shared/types";
import { scrollIntoView } from "../utils";
import type { IActionProvider } from "./action-provider.js";

export interface RenderContext<B extends AnyBlock = AnyBlock> {
	block: B;
	actionProvider: IActionProvider;
	scrollIntoView: typeof scrollIntoView;
}

export interface Component {
	tab: AnyBlock["type"];
	render: (params: RenderContext) => HTMLElement;
}

export interface IComponentRegistry {
	addBlock(component: Component): void;
	renderBlock(block: AnyBlock): HTMLElement | undefined;
}

export class ComponentRegistry implements IComponentRegistry {

	private readonly actionProvider: IActionProvider;
	private readonly components: Partial<
		Record<AnyBlock["type"], Component[]>
	> = {};

	constructor({ actionProvider }: { actionProvider: IActionProvider }) {
		this.actionProvider = actionProvider;
	}

	addBlock(component: Component): void {
		const type = component.tab;

		if (!this.components[type]) {
			this.components[type] = [];
		}

		this.components[type]!.push(component);
	}


	renderBlock(block: AnyBlock): HTMLElement | undefined {
		if (!block.enabled) return;

		const components = this.components[block.type];

		if (!components || components.length === 0) {
			console.warn(`Component not registered for block: ${block.type}`);
			return;
		}

		const fragment = document.createDocumentFragment();

		for (const component of components) {
			const el = component.render({
				block,
				actionProvider: this.actionProvider,
				scrollIntoView,
			});

			if (el) fragment.appendChild(el);
		}

		const wrapper = document.createElement("div");
		wrapper.className = `zh-${block.type}-block`;

		wrapper.appendChild(fragment);

		return wrapper;
	}
}
