import { createBotMessage } from "../utils";

/**
 * Creates an error message for the chat interface.
 * @param message Error message
 * @returns Error message container
 */
export const createErrorMessage = (message: string) => {
	const container = document.createElement("div");
	Object.assign(container.style, {
		backgroundColor: "#fff",
		borderRadius: "3px",
		padding: "15px",
	});

	const header = document.createElement("h1");
	header.textContent = "Ooops. Something is missing.";

	const innerContainer = document.createElement("div");
	Object.assign(innerContainer.style, {
		width: "260px",
	});

	const botMessage = createBotMessage(message);
	const messageElement = document.createElement("p");
	messageElement.textContent = botMessage.message;
	innerContainer.appendChild(messageElement);

	const link = document.createElement("a");
	link.href = "https://fredrikoseberg.github.io/react-chatbot-kit-docs/";
	link.rel = "noopener norefferer";
	link.target = "_blank";
	Object.assign(link.style, {
		display: "block",
		margin: "25px auto",
		color: "rgb(56, 104, 139)",
		padding: "8px",
		border: "1px solid rgb(40, 152, 236)",
		width: "130px",
		textAlign: "center",
		textDecoration: "none",
		fontSize: "1rem",
	});
	link.textContent = "View the docs";

	container.appendChild(header);
	container.appendChild(innerContainer);
	container.appendChild(link);

	return container;
};
