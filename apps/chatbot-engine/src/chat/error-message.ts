import { createBotMessage } from "../utils";

export const createErrorMessage = (message: string) => {
	const container = document.createElement("div");
	container.classList.add("zero-heads-chatbot-error");

	const header = document.createElement("h1");
	header.textContent = "Ooops. Something is missing.";

	const innerContainer = document.createElement("div");
	innerContainer.classList.add("zero-heads-chatbot-error-container");

	const botMessage = createBotMessage(message);
	const messageElement = document.createElement("p");
	messageElement.textContent = botMessage.message;
	innerContainer.appendChild(messageElement);

	const link = document.createElement("a");
	link.href = "https://fredrikoseberg.github.io/react-chatbot-kit-docs/";
	link.rel = "noopener norefferer";
	link.target = "_blank";
	link.classList.add("zero-heads-chatbot-error-docs");
	link.textContent = "View the docs";

	container.appendChild(header);
	container.appendChild(innerContainer);
	container.appendChild(link);

	return container;
};
