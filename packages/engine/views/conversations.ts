import type { ChatbotEngine } from "core/engine";
import type { BotState, View } from "../types";

export function createConversationsView(engine: ChatbotEngine<BotState>): View {
	return {
		header: createConversationsHeader(engine),
		content: createConversationsInnerContainer(engine),
	};
}

function createConversationsHeader(
	engine: ChatbotEngine<BotState>
): HTMLElement {
	const header = document.createElement("div");

	Object.assign(header.style, {
		position: "relative",
		padding: "18px 16px",
		borderBottom: "1px solid rgba(255,255,255,0.06)",
		textAlign: "center",
		fontSize: "18px",
		fontWeight: "600",
		color: "#ffffff",
	});

	header.textContent = "Messages";

	const close = document.createElement("button");
	close.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  `;

	Object.assign(close.style, {
		position: "absolute",
		right: "16px",
		top: "50%",
		transform: "translateY(-50%)",
		background: "transparent",
		border: "none",
		cursor: "pointer",
		color: "#94a3b8",
	});

	close.onclick = () => engine.setState((prev) => ({ ...prev, isOpen: false }));

	header.appendChild(close);

	return header;
}

function createConversationsInnerContainer(
	engine: ChatbotEngine<BotState>
): HTMLElement {
	const container = document.createElement("div");

	Object.assign(container.style, {
		flex: "1",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		padding: "40px 24px",
		gap: "20px",
		background: "#0f172a",
	});

	// Icon
	const icon = document.createElement("div");
	icon.innerHTML = `
    <svg width="42" height="42" viewBox="0 0 24 24"
      fill="none" stroke="#94a3b8"
      stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
    </svg>
  `;

	// Title
	const title = document.createElement("div");
	title.textContent = "No messages";

	Object.assign(title.style, {
		fontSize: "20px",
		fontWeight: "600",
		color: "#ffffff",
	});

	// Subtitle
	const subtitle = document.createElement("div");
	subtitle.textContent = "Messages from the team will be shown here";

	Object.assign(subtitle.style, {
		fontSize: "15px",
		color: "#94a3b8",
		maxWidth: "280px",
		lineHeight: "1.6",
	});

	// CTA Button
	const button = document.createElement("button");
	button.innerHTML = `
    <span>Send us a message</span>
    <span style="margin-left:12px;">➜</span>
  `;

	Object.assign(button.style, {
		marginTop: "20px",
		padding: "14px 20px",
		borderRadius: "16px",
		border: "none",
		background: "#e5e7eb",
		color: "#111827",
		fontSize: "15px",
		fontWeight: "600",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
	});

	button.onclick = () =>
		engine.setState((prev) => ({
			...prev,
			activeTab: "chats",
		}));

	container.append(icon, title, subtitle, button);

	return container;
}
