import stateManager from "../state";
import type {
	ActionProviderConstructor,
	BotState,
	ChatbotActionProvider,
	ChatbotConfig,
	IMessageParser,
	IUpdater,
	MessageParserConstructor,
} from "../types";
import {
	createBotMessage,
	createUserMessage,
	getWidgets,
	validateProps,
} from "../utils";
import WidgetRegistry from "../widget-registry";
import { createBottomNav } from "./bottom-nav";
import { createContent } from "./content";
import { createErrorMessage } from "./error";
import { createLauncher } from "./launcher";

/**
 * Renders the Chatbot Widget on DOM.
 * @param rootEl The root element to render the chatbot in
 * @param config The configuration for the chatbot
 * @param MessageParser The message parser to use
 * @param ActionProvider The action provider to use
 */
const renderWidget = (
	rootEl: HTMLElement,
	config: ChatbotConfig,
	MessageParser: MessageParserConstructor,
	ActionProvider: ActionProviderConstructor
): void => {
	// If the required props are not provided, render an error message
	if (!(config && MessageParser && ActionProvider)) {
		renderError(
			rootEl,
			"Missing required props: config, MessageParser or ActionProvider."
		);
		return;
	}
	// Validate the Props
	const propsErrors = validateProps(config, MessageParser);
	if (propsErrors.length) {
		const errorMessage = propsErrors.map((e) => e.message).join("\n");
		renderError(rootEl, errorMessage);
		return;
	}

	// The Initial State of the Bot
	const initialState: BotState = {
		botName: config.botName,
		isOpen: false,
		activeTab: "home",
		messages: [...config.initialMessages],
		...config.state,
	};

	// State Manager Instance
	const [state, updater, registerListeners] =
		stateManager<BotState>(initialState);

	// Action Provider Instance
	const actionProviderInstance: ChatbotActionProvider = new ActionProvider(
		createBotMessage,
		updater,
		createUserMessage
	);

	// Message Parser Instance
	const messageParserInstance: IMessageParser = new MessageParser(
		actionProviderInstance
	);

	// Widget Registry Instance
	const widgetRegistry = new WidgetRegistry({
		setStateFunc: updater,
		actionProvider: actionProviderInstance,
	});

	// Add Widgets to the Widget Registry
	for (const widget of getWidgets(config)) {
		widgetRegistry.addWidget(widget);
	}

	// Subscribe to State Changes
	registerListeners((newState) =>
		render(rootEl, newState, messageParserInstance, updater, widgetRegistry)
	);

	// Initial Render
	render(rootEl, state, messageParserInstance, updater, widgetRegistry);
};

const render = (
	rootEl: HTMLElement,
	state: BotState,
	messageParser: IMessageParser,
	updater: IUpdater,
	widgetRegistry: WidgetRegistry
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

		panel.appendChild(
			createContent(state, messageParser, updater, widgetRegistry)
		);

		panel.appendChild(createBottomNav(state, updater));

		wrapper.appendChild(panel);
	}

	// Hide launcher when open
	if (!state.isOpen) {
		wrapper.appendChild(createLauncher(state, updater));
	}

	rootEl.appendChild(wrapper);
};

export function renderError(rootEl: HTMLElement, message: string) {
	rootEl.replaceChildren();
	rootEl.appendChild(createErrorMessage(message));
}

export default renderWidget;

export function injectGlobalStyles() {
	if (document.getElementById("zh-widget-global")) return;

	const style = document.createElement("style");
	style.id = "zh-widget-global";

	style.innerHTML = `
    .zh-widget-panel {
      width: 380px;
      height: min(640px, 80vh);
      background: #0f172a;
      border-radius: 22px;
      box-shadow:
        0 40px 100px rgba(0,0,0,0.45),
        0 10px 30px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: zh-widget-enter 0.25s ease;
    }

    @keyframes zh-widget-enter {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Smooth close animation */
    @keyframes zh-widget-exit {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(16px) scale(0.96);
      }
    }

    /* ========================= */
    /* 📱 Responsive Mobile Mode */
    /* ========================= */
    @media (max-width: 640px) {
      .zh-widget-wrapper {
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw;
        height: 100vh;
      }

      .zh-widget-panel {
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0 !important;
      }
    }

    /* Tablet refinement */
    @media (max-width: 900px) {
      .zh-widget-wrapper {
        right: 20px;
        bottom: 20px;
      }

      .zh-widget-panel {
        width: min(92vw, 380px);
        height: min(85vh, 640px);
      }
    }
  `;

	document.head.appendChild(style);
}
