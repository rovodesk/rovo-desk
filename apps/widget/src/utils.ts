import type { WidgetState } from "@zero-heads-lab/engine";
import type { AnyBlock, WidgetTabType } from "@zero-heads-lab/shared/types";
import { type ScreenKey, screenRegistry } from "./screens";
import { WelcomeScreen } from "./screens/welcome";

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

export function resolveActiveBlocks(state: WidgetState): AnyBlock[] {
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
		(screen: { tab: WidgetTabType }) => screen.tab === activeTab
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

const TAB_TO_SCREEN: Partial<Record<WidgetTabType, ScreenKey>> = {
	welcome: "welcome",
	conversation: "conversation",
	inbox: "inbox",
	knowledge_base: "knowledge_base",
	publications: "publications",
};

export function resolveScreen(state: WidgetState) {
	// 1. If there's a route pushed to the stack, respect it
	const routes = state.routes || [];
	if (routes.length > 0) {
		const currentRoute = routes[routes.length - 1];
		if (currentRoute?.name && screenRegistry[currentRoute.name as ScreenKey]) {
			return screenRegistry[currentRoute.name as ScreenKey];
		}
	}

	// 2. Otherwise fallback to activeTab's default screen
	const tab = resolveActiveTab(state);
	const screenKey = TAB_TO_SCREEN[tab];

	if (screenKey && screenRegistry[screenKey]) {
		return screenRegistry[screenKey];
	}

	return WelcomeScreen;
}

export function resolveActiveTab(state: WidgetState) {
	const modeConfig = state.widgetConfig?.screens?.[state.mode];

	if (!modeConfig) return "welcome";

	const availableTabs = Object.keys(screenRegistry);

	// 🚨 DO NOT override valid tab
	if (state.activeTab && availableTabs.includes(state.activeTab)) {
		return state.activeTab;
	}

	return modeConfig.defaultTab;
}
