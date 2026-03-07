import { ChatbotEngine } from "core/engine";
import { mountWidget } from "core/renderer";
import { welcomeCTAComponent } from "screens/welcome/cta";
import { welcomeHeaderComponent } from "screens/welcome/header";
import { welcomeHeroComponent } from "screens/welcome/hero";
import type { BotState, CommandArgs, RovoDeskFunction } from "types";

declare global {
	interface Window {
		RovoDesk?: RovoDeskFunction & { q?: CommandArgs[] };
		__ROVODESK_SDK_LOADED__?: boolean;
	}
}

export const widgetComponents = [
	welcomeHeaderComponent,
	welcomeHeroComponent,
	welcomeCTAComponent,
];

(function bootstrap() {
	if (window.__ROVODESK_SDK_LOADED__) return;
	window.__ROVODESK_SDK_LOADED__ = true;

	let initialized = false;

	const engine = new ChatbotEngine<BotState>({
		initialState: {
			mode: "visitor",
			isOpen: false,
			messages: [],
		},

		components: widgetComponents,
	});

	const execute = async (args: CommandArgs) => {
		const [command, payload] = args;
		switch (command) {
			case "init":
				if (initialized) return;
				initialized = true;

				await engine.dispatch(args);
				break;

			case "open":
				engine.dispatch(["open"]);
				break;

			case "close":
				engine.dispatch(["close"]);
				break;

			case "identify":
				engine.dispatch(["identify", payload]);
				break;

			case "track":
				engine.dispatch(["track", payload]);
				break;

			case "update":
				engine.dispatch(["update", payload]);
				break;

			case "switch-tab":
				engine.dispatch(["switch-tab", payload]);
				break;

			case "shutdown":
				engine.dispatch(["shutdown"]);
				break;

			default:
				console.warn(`RovoDesk: Unknown command "${command}"`);
				break;
		}
	};

	/*
		Get queued loader commands
	*/
	const existing = window.RovoDesk;
	const queue = existing?.q ?? [];

	/*
		Replace queue function with real SDK
	*/
	const RovoDesk: RovoDeskFunction = (...args: CommandArgs) => {
		execute(args);
	};

	window.RovoDesk = RovoDesk;

	// Create Root Element
	const root = document.createElement("div");
	root.id = "rovo-desk-root";
	document.body.appendChild(root);

	// Mount Widget
	mountWidget(root, engine);

	/*
		Flush loader queue
	*/
	for (const args of queue) {
		execute(args);
	}
})();
