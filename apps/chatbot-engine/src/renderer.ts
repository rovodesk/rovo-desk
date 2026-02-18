import renderChat from "./chat";
import { createErrorMessage } from "./chat/error-message";
import stateManager from "./state";
import type {
	ActionProviderConstructor,
	ChatbotActionProvider,
	ChatbotConfig,
	ChatState,
	IMessageParser,
	IUpdater,
	MessageParserConstructor,
} from "./types";
import {
	createBotMessage,
	createClientMessage,
	createUserMessage,
	getWidgets,
	validateProps,
} from "./utils";
import WidgetRegistry from "./widget-registry";

let current: HTMLElement | null = null;

const renderChatbot = (
	rootEl: HTMLElement,
	config: ChatbotConfig,
	MessageParser: MessageParserConstructor,
	ActionProvider: ActionProviderConstructor
): void => {
	if (!(config && MessageParser && ActionProvider)) {
		renderErrorMessage(
			rootEl,
			"Missing required props: config, MessageParser or ActionProvider."
		);
	}

	const propsErrors = validateProps(config, MessageParser);

	if (propsErrors.length) {
		const errorMessage = propsErrors.map((e) => e.message).join("\n");
		renderErrorMessage(rootEl, errorMessage);
		return;
	}

	const initialState: ChatState = {
		messages: [...config.initialMessages],
		...config.state,
	};

	const [state, updater, registerListeners] =
		stateManager<ChatState>(initialState);

	const actionProviderInstance: ChatbotActionProvider = new ActionProvider(
		createBotMessage,
		updater,
		createUserMessage,
		createClientMessage
	);

	const messageParserInstance: IMessageParser = new MessageParser(
		actionProviderInstance
	);

	const widgetRegistry = new WidgetRegistry({
		setStateFunc: updater,
		actionProvider: actionProviderInstance,
	});

	for (const widget of getWidgets(config)) {
		widgetRegistry.addWidget(widget);
	}

	registerListeners((newState) =>
		render(
			rootEl,
			newState,
			messageParserInstance,
			config,
			updater,
			widgetRegistry
		)
	);

	render(rootEl, state, messageParserInstance, config, updater, widgetRegistry);
};

const renderErrorMessage = (rootEl: HTMLElement, message: string): void => {
	if (current) {
		rootEl.removeChild(current);
	}

	const errorElement = createErrorMessage(message);
	current = errorElement;
	rootEl.appendChild(errorElement);
	return;
};

const render = (
	rootEl: HTMLElement,
	state: ChatState,
	messageParserInstance: IMessageParser,
	config: ChatbotConfig,
	updater: IUpdater,
	widgetRegistry: WidgetRegistry
): void => {
	if (current) {
		rootEl.removeChild(current);
	}

	const wrapper = document.createElement("div");
	wrapper.classList.add("zero-heads-widget-wrapper");

	const toggleBtn = document.createElement("button");
	toggleBtn.classList.add("zero-heads-widget-button");
	toggleBtn.innerHTML = "💬";

	const chatContainer = document.createElement("div");
	chatContainer.classList.add("zero-heads-widget-chat");
	chatContainer.style.display = "none";

	const chat = renderChat(
		config,
		state,
		messageParserInstance,
		updater,
		widgetRegistry
	);

	chatContainer.appendChild(chat);

	toggleBtn.onclick = () => {
		const isOpen = chatContainer.style.display === "block";
		chatContainer.style.display = isOpen ? "none" : "block";
	};

	wrapper.appendChild(chatContainer);
	wrapper.appendChild(toggleBtn);

	current = wrapper;
	rootEl.appendChild(wrapper);
};

export default renderChatbot;
