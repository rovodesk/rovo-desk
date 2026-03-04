import type { ChatbotConfig } from "./core/config";
import { ChatbotEngine } from "./core/engine";
import { renderWidget } from "./render";
import { injectGlobalStyles } from "./render/style";
import type { BotState } from "./types";

declare global {
	interface Window {
		zeroHeadsSettings?: ChatbotConfig;
	}
}

/* ------------------------------------------
   SDK Init Entry Point
------------------------------------------ */

function init(config: ChatbotConfig) {
	if (!(config?.organizationId && config?.accessKey)) {
		console.error("ZeroHeads: Missing organizationId or publicKey.");
		return;
	}

	injectGlobalStyles();

	const initialState: BotState = {
		isOpen: config.display?.defaultOpen ?? false,
		isElevated: false,
		messages: [...(config.chatbot?.welcomeMessages ?? [])],
		canvas: undefined,
		activeViewId: "",
	};

	const engine = new ChatbotEngine({ initialState });

	let root = document.getElementById("chatbot-root");

	if (!root) {
		root = document.createElement("div");
		root.id = "chatbot-root";
		document.body.appendChild(root);
	}

	renderWidget(root, config, engine);

	// Fetch canvas
	if (!config.apiBaseUrl) {
		console.warn("ZeroHeads: apiBaseUrl not provided.");
		return;
	}

	fetch(`${config.apiBaseUrl}/init`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-access-key": config.accessKey,
		},
		body: JSON.stringify({
			workspaceId: config.organizationId,
			user: config.user,
			accessKey: config.accessKey,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (!data.canvas) return;

			engine.updateState({
				canvas: data.canvas,
				activeViewId: data.canvas.views[0]?.id ?? "",
			});
		})
		.catch((err) => {
			console.error("ZeroHeads: Failed to initialize.", err);
		});
}

/* ------------------------------------------
   Expose Global SDK
------------------------------------------ */

if (window.zeroHeadsSettings) {
	init(window.zeroHeadsSettings);
}
