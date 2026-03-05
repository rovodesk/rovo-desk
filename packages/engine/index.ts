import type { SDKConfig } from "config";
import type { User } from "types";
import { initSDK } from "./functions/init";

declare global {
	interface Window {
		RovoDesk?: CommandFunction & { q?: unknown[][] };
		__ROVODESK_SDK_LOADED__?: boolean;
	}
}

type CommandMap = {
	init: (config: SDKConfig) => Promise<void>;
	open: () => void;
	close: () => void;
	identify: (user: User) => void;
	track: (event: string, data?: unknown) => void;
	update: (data: Partial<SDKConfig>) => void;
	shutdown: () => void;
};

type CommandFunction = (command: keyof CommandMap, payload?: unknown) => void;

(function bootstrap() {
	if (window.__ROVODESK_SDK_LOADED__) {
		return;
	}

	window.__ROVODESK_SDK_LOADED__ = true;

	let initialized = false;

	const commands: CommandMap = {
		init: async (config) => {
			if (initialized) return;
			initialized = true;

			await initSDK(config);
		},

		open: () => console.log("Open widget"),
		close: () => console.log("Close widget"),

		identify: (user: User) => {
			console.log("Identify user", user);
		},

		track: (event: string, data?: unknown) => {
			console.log("Track event", event, data);
		},

		update: (data: Partial<SDKConfig>) => {
			console.log("Update config", data);
		},

		shutdown: () => {
			console.log("Shutdown");
		},
	};

	function runCommand(command: string, payload?: unknown) {
		const handler = commands[command as keyof CommandMap];

		if (!handler) {
			console.warn(`RovoDesk: Unknown command "${command}"`);
			return;
		}

		handler(payload as never);
	}

	const rd = window.RovoDesk;

	if (!rd) return;

	const queue = rd.q ?? [];

	const RovoDesk: CommandFunction = (command, payload) => {
		runCommand(command, payload);
	};

	window.RovoDesk = RovoDesk;

	for (const args of queue) {
		const [command, payload] = args;
		runCommand(command as string, payload);
	}
})();
