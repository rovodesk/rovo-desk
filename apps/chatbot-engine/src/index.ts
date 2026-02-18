import renderChatbot from "./renderer";
import type { ChatbotActionProvider, IUpdater } from "./types";
import {
	createBotMessage,
	createClientMessage,
	createUserMessage,
} from "./utils";

/**
 * Declare global typing FIRST
 */
declare global {
	interface Window {
		vanillaJsChatbot?: {
			renderChatbot: typeof renderChatbot;
			createBotMessage: typeof createBotMessage;
		};
	}
}

console.log("Started Chatbot");

/**
 * Attach to window (for classic <script> usage)
 */
window.vanillaJsChatbot = {
	renderChatbot,
	createBotMessage,
};

/**
 * Wait for DOM to be ready
 */
document.addEventListener("DOMContentLoaded", () => {
	const root = document.getElementById("chatbot-root");

	if (!root) {
		console.error("chatbot-root element not found");
		return;
	}

	const config = {
		botName: "ZeroHeadsBot",
		initialMessages: [createBotMessage("Hi! Type 'hello' to test me.")],
	};

	class ActionProvider implements ChatbotActionProvider {
		createBotMessage: typeof createBotMessage;
		createClientMessage: typeof createClientMessage;
		createUserMessage: typeof createUserMessage;
		stateUpdater: IUpdater;

		constructor(createbotMessage: typeof createBotMessage, setState: IUpdater) {
			this.createBotMessage = createbotMessage;
			this.createClientMessage = createClientMessage;
			this.createUserMessage = createUserMessage;
			this.stateUpdater = setState;
		}
	}

	class MessageParser {
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
	renderChatbot(root, config, MessageParser, ActionProvider);
});
