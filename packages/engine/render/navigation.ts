import type { ChatbotEngine } from "../core/engine";
import type { BotState, Tab } from "../types";

export function createNavigation(
	state: BotState,
	engine: ChatbotEngine<BotState>
) {
	const nav = document.createElement("div");

	Object.assign(nav.style, {
		padding: "14px 16px 18px", // more breathing room
		background: "#0f172a",
		borderTop: "1px solid rgba(255,255,255,0.06)",
	});

	const inner = document.createElement("div");

	Object.assign(inner.style, {
		display: "flex",
		gap: "8px",
	});

	const tabs: Tab[] = ["home", "conversations", "help", "updates"];

	tabs.forEach((tab) => {
		const btn = document.createElement("button");
		const isActive = state.activeTab === tab;

		btn.textContent = getTabTitle(tab);

		Object.assign(btn.style, {
			flex: "1",
			padding: "10px 12px",
			borderRadius: "10px",
			border: "none",
			cursor: "pointer",
			fontSize: "13px",
			fontWeight: isActive ? "600" : "500",
			background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
			color: isActive ? "#ffffff" : "#94a3b8",
			transition: "all 0.2s ease",
		});

		btn.onmouseenter = () => {
			if (!isActive) {
				btn.style.background = "rgba(255,255,255,0.05)";
				btn.style.color = "#e2e8f0";
			}
		};

		btn.onmouseleave = () => {
			if (!isActive) {
				btn.style.background = "transparent";
				btn.style.color = "#94a3b8";
			}
		};

		btn.onclick = () =>
			engine.setState((prev) => ({
				...prev,
				activeTab: tab,
			}));

		inner.appendChild(btn);
	});

	nav.appendChild(inner);

	return nav;
}

export function getTabTitle(tab: BotState["activeTab"]) {
	switch (tab) {
		case "home":
			return "Home";
		case "conversations":
			return "Conversations";
		case "chats":
			return "Chats";
		case "help":
			return "Help";
		case "updates":
			return "Updates";
		default:
			return "";
	}
}
