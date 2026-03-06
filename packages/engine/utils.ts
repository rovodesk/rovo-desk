import type { AnyBlock, TabType } from "@zero-heads-lab/shared/types";
import type { BotState } from "types";

export const getObject = (object: unknown): Record<string, unknown> | null => {
	if (object && typeof object === "object") {
		return object as Record<string, unknown>;
	}
	return null;
};

export const scrollIntoView = (): void => {
	const chatContainer = document.querySelector<HTMLElement>(
		".zero-heads-chatbot-chat-message-container"
	);

	if (!chatContainer) return;

	chatContainer.scrollTop = chatContainer.scrollHeight;
};

export function isSDKInitialized(state: BotState) {
	return Boolean(state.widgetConfig);
}

export function resolveActiveBlocks(state: BotState): AnyBlock[] {
	// biome-ignore lint/suspicious/noExplicitAny: To support legacy API structure
	const widgetScreens = state.widgetConfig?.screens as Record<string, any>;
	console.log("Widget Screens", widgetScreens);
	if (!widgetScreens) return [];

	let modeConfig = widgetScreens[state.mode];

	// Handle old schema fallback
	if (!modeConfig && widgetScreens.screens) {
		modeConfig = widgetScreens;
	}

	if (!modeConfig) return [];

	const activeTab = state.activeTab ?? modeConfig.defaultTab;
	const screen = modeConfig.screens.find(
		(screen: { tab: TabType }) => screen.tab === activeTab
	);

	return screen?.blocks ?? [];
}

// export const validateProps = (
// 	config: SDKConfig,
// 	MessageParser: IMessageParser
// ) => {
// 	const errors: Error[] = [];

// 	if (!config?.?.welcomeMessages) {
// 		errors.push(
// 			new Error(
// 				"Config must contain property 'welcomeMessage', and it expects it to be an array of chatbotmessages."
// 			)
// 		);
// 	}

// 	if (!MessageParser) {
// 		errors.push(
// 			new Error(
// 				"Messageparser must implement the method 'parse', please add this method to your object. The signature is parse(message: string)."
// 			)
// 		);
// 	}

// 	return errors;
// };

export function onDomReady(callback: () => void) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", callback, { once: true });
	} else {
		callback();
	}
}

export function resolveRadius(radius?: "sm" | "md" | "lg") {
	switch (radius) {
		case "sm":
			return "14px";
		case "lg":
			return "28px";
		default:
			return "22px";
	}
}
