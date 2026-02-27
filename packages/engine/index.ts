import type { ChatbotConfig } from "./core/config";
import { ChatbotEngine } from "./core/engine";
import { type render, renderWidget } from "./render";
import { injectGlobalStyles } from "./render/style";
import type { BotState } from "./types";
import { onDomReady } from "./utils";

declare global {
	interface Window {
		zeroHeadsChatbot?: {
			renderChatbot: typeof render;
		};
	}
}

// Inject scrollbar style once
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

const config: ChatbotConfig = {
	organizationId: "1234",
	connectionId: "http://localhost:3000",
	publicKey: "1234",
	chatbot: {
		welcomeMessages: [
			{
				id: "1",
				message: "Hello! How can I help you today?",
				type: "system",
				timestamp: Date.now(),
			},
		],
	},
};

document.addEventListener("DOMContentLoaded", () => {
	const initialState: BotState = {
		isOpen: false,
		isElevated: false,
		activeTab: "home",
		messages: [...(config.chatbot?.welcomeMessages ?? [])],
	};

	const engine = new ChatbotEngine({ initialState });

	onDomReady(() => {
		let root = document.getElementById("chatbot-root");

		if (!root) {
			root = document.createElement("div");
			root.id = "chatbot-root";
			document.body.appendChild(root);
		}

		renderWidget(root, config, engine);
		injectGlobalStyles();
	});

	onDomReady(() => {
		let root = document.getElementById("chatbot-root");

		if (!root) {
			root = document.createElement("div");
			root.id = "chatbot-root";
			document.body.appendChild(root);
		}

		renderWidget(root, config, engine);
		injectGlobalStyles();
	});
});
