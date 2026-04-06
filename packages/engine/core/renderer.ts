import type { AnyBlock } from "@zero-heads-lab/shared/lib/types";
import { renderError } from "components/error";
import { createLauncher } from "components/launcher";
import { renderLoading } from "components/loading";
import type { ChatbotEngine } from "core/engine";
import { screenRegistry } from "screens";
import { renderWelcomeScreen } from "screens/welcome";
import type { BotState } from "types";

export const renderBlock = (
	block: AnyBlock,
	engine: ChatbotEngine<BotState>
): HTMLElement | null => {
	const blockEl = engine.componentRegistry.renderBlock(block);

	if (!blockEl) return null;

	const container = document.createElement("div");
	container.className = `zh-${block.type}-block`;

	Object.assign(container.style, {
		display: "flex",
		flexDirection: "column",
	});

	container.appendChild(blockEl);

	return container;
};

export const renderScreen = (
	blocks: AnyBlock[],
	engine: ChatbotEngine<BotState>
): HTMLElement => {
	const container = document.createElement("div");

	Object.assign(container.style, {
		display: "flex",
		flexDirection: "column",
		flex: "1",
		overflowY: "auto",
		gap: "12px",
		padding: "16px",
	});

	const enabledBlocks = blocks.filter((block) => block.enabled);
	if (!enabledBlocks.length) {
		const empty = document.createElement("div");
		empty.textContent = "No content available";
		Object.assign(empty.style, {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			color: "#000",
			font: "bold",
		});
		container.appendChild(empty);
		return container;
	}

	enabledBlocks.forEach((block) => {
		const blockEl = renderBlock(block, engine);
		if (blockEl) container.appendChild(blockEl);
	});

	return container;
};

export const renderWidget = (
	rootEl: HTMLElement,
	engine: ChatbotEngine<BotState>
): void => {
	if (!(engine && rootEl)) {
		renderError(rootEl, "Missing required props: engine.");
		return;
	}

	rootEl.replaceChildren();

	const state = engine.getState();
	// Loading Guard
	if (!state.widgetConfig) {
		renderLoading(rootEl);
		return;
	}

	const wrapper = document.createElement("div");
	wrapper.className = "zh-widget-wrapper";

	const position = state.widgetConfig?.launcher?.position ?? "bottom-right";

	const horizontal = position.includes("right") ? "right" : "left";
	const vertical = position.includes("bottom") ? "bottom" : "top";

	Object.assign(wrapper.style, {
		position: "fixed",
		[horizontal]: "20px",
		[vertical]: "20px",
		zIndex: "9999",
		display: "flex",
		flexDirection: "column",
		alignItems: horizontal === "right" ? "flex-end" : "flex-start",
	});

	const theme = state.widgetConfig?.theme;

	/* ---------------- Widget Panel ---------------- */

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
		});

		const renderer =
			screenRegistry[state.activeTab as keyof typeof screenRegistry] ??
			renderWelcomeScreen;

		const screen = renderer(state, engine);

		panel.appendChild(screen);

		wrapper.appendChild(panel);
	}

	/* ---------------- Launcher ---------------- */

	if (!(state.isOpen || state.widgetConfig?.launcher?.hideDefault)) {
		wrapper.appendChild(createLauncher(state, engine));
	}

	rootEl.appendChild(wrapper);
};

export const mountWidget = (
	rootEl: HTMLElement,
	engine: ChatbotEngine<BotState>
) => {
	const render = () => renderWidget(rootEl, engine);
	const unsubscribe = engine.subscribe(render);
	render(); // initial render
	return unsubscribe;
};
