import { resolveRadius } from "utils";
import type { ChatbotConfig } from "../core/config";
import type { ChatbotEngine } from "../core/engine";
import type { BotState } from "../types";
import { renderError } from "./error.js";
import { createLauncher } from "./launcher.js";
import { createNavigation } from "./navigation.js";

export const render = (
	rootEl: HTMLElement,
	state: BotState,
	engine: ChatbotEngine<BotState>
): void => {
	rootEl.replaceChildren();

	const wrapper = document.createElement("div");
	wrapper.className = "zh-widget-wrapper";
	Object.assign(wrapper.style, {
		position: "fixed",
		bottom: "20px",
		right: "20px",
		zIndex: "1000",
	});

	if (state.isOpen) {
		const panel = document.createElement("div");
		panel.className = "zh-widget-panel";

		const theme = state.canvas?.theme;

		Object.assign(panel.style, {
			width: "380px",
			height: "min(640px, 80vh)",
			background: theme?.colors?.background ?? "#0f172a",
			borderRadius: resolveRadius(theme?.radius),
			boxShadow: "0 40px 100px rgba(0,0,0,0.45), 0 10px 30px rgba(0,0,0,0.25)",
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			animation: "zh-widget-fade-in 0.25s ease",
		});

		// Render Canvas
		panel.appendChild(engine.renderCanvas(state));

		// Render Navigation only if multiple labeled views
		const labeledViews = state.canvas?.views.filter((v) => v.label) ?? [];

		if (labeledViews.length > 1) {
			panel.appendChild(createNavigation(state, engine));
		}

		wrapper.appendChild(panel);
	}

	// Hide launcher when open
	if (!state.isOpen) {
		wrapper.appendChild(createLauncher(state, engine));
	}

	rootEl.appendChild(wrapper);
};

export const renderWidget = (
	rootEl: HTMLElement,
	config: ChatbotConfig,
	engine: ChatbotEngine<BotState>
): (() => void) => {
	// If the required props are not provided, render an error message
	if (!(config && engine)) {
		renderError(rootEl, "Missing required props: config or engine.");
		return () => null;
	}
	// Validate the Props
	// const propsErrors = validateProps(config, engine);
	// if (propsErrors.length) {
	// 	const errorMessage = propsErrors.map((e) => e.message).join("\n");
	// 	renderError(rootEl, errorMessage);
	// 	return;
	// }

	const renderFromState = (state: BotState) => {
		render(rootEl, state, engine);
	};

	// Subscribe once
	const unsubscribe = engine.subscribe(renderFromState);

	// Initial render
	renderFromState(engine.getState());

	// Optional: return cleanup for unmounting
	return () => unsubscribe();
};
