import {
	ActionProvider,
	initialStore,
	type WidgetState,
} from "@zero-heads-lab/engine";
import { createRoot, type Root } from "react-dom/client";
import { WidgetProvider } from "../context";
import { Widget } from "./widget";

const globalStore =
	(window as any).__ROVODESK_STORE__ ??
	initialStore<WidgetState>({
		mode: "visitor",
		isOpen: false,
		activeTab: "welcome",
		isInitialized: false,
	});

(window as any).__ROVODESK_STORE__ = globalStore;

const store = globalStore;

const globalActions =
	(window as any).__ROVODESK_ACTIONS__ ?? new ActionProvider(store);

(window as any).__ROVODESK_ACTIONS__ = globalActions;

const actions = globalActions;

const roots = new WeakMap<HTMLElement, Root>();

export function mountWidget(rootEl: HTMLElement) {
	if (!rootEl) {
		throw new Error("[Rovodesk] Root element is required");
	}

	let root = roots.get(rootEl);

	if (!root) {
		root = createRoot(rootEl);
		roots.set(rootEl, root);
	}

	root.render(
		<WidgetProvider actions={actions} store={store}>
			<Widget />
		</WidgetProvider>
	);

	return {
		store,
		actions,
		unmount: () => {
			root?.unmount();
			roots.delete(rootEl);
		},
	};
}
