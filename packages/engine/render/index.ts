import type { ChatbotConfig } from "../core/config";
import type { ChatbotEngine } from "../core/engine";
import type { BotState } from "../types";
import { createContent } from "./content.js";
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
		Object.assign(panel.style, {
			width: "380px",
			height: "min(640px, 80vh)",
			background: "#0f172a",
			borderRadius: "22px",
			boxShadow: "0 40px 100px rgba(0,0,0,0.45), 0 10px 30px rgba(0,0,0,0.25)",
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			animation: "zh-widget-fade-in 0.25s ease",
		});

		panel.appendChild(createContent(state, engine));

		panel.appendChild(createNavigation(state, engine));

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
): void => {
	// If the required props are not provided, render an error message
	if (!(config && engine)) {
		renderError(rootEl, "Missing required props: config or engine.");
		return;
	}
	// Validate the Props
	// const propsErrors = validateProps(config, engine);
	// if (propsErrors.length) {
	// 	const errorMessage = propsErrors.map((e) => e.message).join("\n");
	// 	renderError(rootEl, errorMessage);
	// 	return;
	// }

	// Subscribe to engine state changes
	engine.subscribe((newState) => {
		render(rootEl, newState, engine);
	});

	// Initial render
	render(rootEl, engine.getState(), engine);
};
