import type { ChatbotConfig } from "./core/config";
import type { IMessageParser } from "./core/message-parser";

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

export const validateProps = (
	config: ChatbotConfig,
	MessageParser: IMessageParser
) => {
	const errors: Error[] = [];

	if (!config?.chatbot?.welcomeMessages) {
		errors.push(
			new Error(
				"Config must contain property 'welcomeMessage', and it expects it to be an array of chatbotmessages."
			)
		);
	}

	if (!MessageParser) {
		errors.push(
			new Error(
				"Messageparser must implement the method 'parse', please add this method to your object. The signature is parse(message: string)."
			)
		);
	}

	return errors;
};

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
