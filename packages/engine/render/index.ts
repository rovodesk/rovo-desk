import type { SDKConfig } from "config";
import type { ChatbotEngine } from "../core/engine";
import type { BotState } from "../types";
import { renderError } from "./error.js";
import { createLauncher } from "./launcher.js";

export const render = (
	rootEl: HTMLElement,
	state: BotState,
	engine: ChatbotEngine<BotState>
): void => {
	rootEl.replaceChildren();

	const wrapper = document.createElement("div");
	wrapper.className = "zh-widget-wrapper";

	const position = state.config?.launcher?.position ?? "right";

	Object.assign(wrapper.style, {
		position: "fixed",
		bottom: "20px",
		[position]: "20px",
		zIndex: "9999",
		display: "flex",
		flexDirection: "column",
		alignItems: position === "right" ? "flex-end" : "flex-start",
	});

	const theme = state.config?.theme;

	if (state.isOpen) {
		const panel = document.createElement("div");
		panel.className = "zh-widget-panel";

		Object.assign(panel.style, {
			width: `${theme?.widgetWidth ?? 380}px`,
			height: `${theme?.widgetHeight ?? 600}px`,
			maxHeight: "80vh",
			background: theme?.backgroundColor ?? "#ffffff",
			borderRadius: `${theme?.borderRadius ?? 16}px`,
			boxShadow: theme?.shadow
				? "0 40px 100px rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.15)"
				: "none",
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			animation: "zh-widget-fade-in 0.2s ease",
		});

		/* -------------------------
       Render Screen Blocks
    -------------------------- */

		const screens = state.config?.screens;
		const isUser = Boolean(state.user);

		const blocks = isUser ? (screens?.users ?? []) : (screens?.visitors ?? []);

		const canvas = document.createElement("div");

		Object.assign(canvas.style, {
			flex: "1",
			display: "flex",
			flexDirection: "column",
			gap: "12px",
			padding: "16px",
			overflowY: "auto",
		});

		blocks
			.filter((b) => b.enabled)
			.forEach((block) => {
				const el = engine.renderBlock(block, state);
				if (el) canvas.appendChild(el);
			});

		panel.appendChild(canvas);

		wrapper.appendChild(panel);
	}

	/* -------------------------
     Launcher
  -------------------------- */

	if (!(state.isOpen || state.config?.launcher?.hideDefault)) {
		wrapper.appendChild(createLauncher(state, engine));
	}

	rootEl.appendChild(wrapper);
};

export const renderWidget = (
	rootEl: HTMLElement,
	config: SDKConfig,
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

	const stateListener = (state: BotState) => {
		render(rootEl, state, engine);
	};

	// Subscribe once
	const unsubscribe = engine.subscribe(stateListener);

	// Initial render
	stateListener(engine.getState());

	// Optional: return cleanup for unmounting
	return () => unsubscribe();
};
