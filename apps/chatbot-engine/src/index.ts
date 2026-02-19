import type {
	ChatbotActionProvider,
	ChatbotConfig,
	IMessageParser,
	IUpdater,
} from "./types";
import renderChatbot, { injectGlobalStyles } from "./ui";
import { createBotMessage, createUserMessage, onDomReady } from "./utils";

declare global {
	interface Window {
		zeroHeadsChatbot?: {
			renderChatbot: typeof renderChatbot;
			createBotMessage: typeof createBotMessage;
		};
	}
}

// Scrollbar
if (!document.getElementById("zh-scroll-style")) {
	const style = document.createElement("style");
	style.id = "zh-scroll-style";
	style.innerHTML = `
    .zh-widget-chat-container::-webkit-scrollbar {
      width: 6px;
    }
    .zh-widget-chat-container::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
    }
  `;
	document.head.appendChild(style);
}

/**
 * Load the chatbot when the DOM is ready.
 */
document.addEventListener("DOMContentLoaded", () => {
	let root: HTMLElement;

	// Bot configuration
	const config: ChatbotConfig = {
		botName: "ZeroHeadsBot",
		initialMessages: [createBotMessage("Hi! Type 'hello' to test me.")],
	};

	// Message parser class
	class MessageParser implements IMessageParser {
		private readonly actionProvider: ChatbotActionProvider;

		constructor(actionProvider: ChatbotActionProvider) {
			this.actionProvider = actionProvider;
		}

		parse(message: string) {
			if (message.toLowerCase().includes("hello")) {
				const reply = this.actionProvider.createBotMessage(
					"Hello 👋 I am working!"
				);

				this.actionProvider.stateUpdater((state) => ({
					...state,
					messages: [...state.messages, reply],
				}));
			}
		}
	}

	// Action provider class
	class ActionProvider implements ChatbotActionProvider {
		createBotMessage: typeof createBotMessage;
		createUserMessage: typeof createUserMessage;
		stateUpdater: IUpdater;

		constructor(createbotMessage: typeof createBotMessage, setState: IUpdater) {
			this.createBotMessage = createbotMessage;
			this.createUserMessage = createUserMessage;
			this.stateUpdater = setState;
		}
	}

	// Wait for the DOM to be ready.
	onDomReady(() => {
		console.log("Started Chatbot");
		// Get the root element.
		root = document.getElementById("chatbot-root")!;
		if (!root) {
			// If not found, create the root Element.
			root = document.createElement("div");
			root.id = "chatbot-root";
			document.body.appendChild(root);
		}
		// Render the chatbot once the DOM is ready.
		renderChatbot(root, config, MessageParser, ActionProvider);
		//Apply Global Styles
		injectGlobalStyles();
	});
});
