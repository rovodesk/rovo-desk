import type { ChatbotEngine } from "../core/engine";
import type { BotState } from "../types";

export function createNavigation(
	state: BotState,
	engine: ChatbotEngine<BotState>
) {
	const nav = document.createElement("div");

	Object.assign(nav.style, {
		padding: "14px 16px 18px",
		background: "#0f172a",
		borderTop: "1px solid rgba(255,255,255,0.06)",
	});

	const inner = document.createElement("div");

	Object.assign(inner.style, {
		display: "flex",
		gap: "8px",
	});

	const views = state.canvas?.views ?? [];

	views.forEach((view) => {
		if (!view.label) return; // only show views that have labels

		const btn = document.createElement("button");
		const isActive = state.activeViewId === view.id;

		btn.textContent = view.label;

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
			engine.updateState({
				activeViewId: view.id,
			});

		inner.appendChild(btn);
	});

	nav.appendChild(inner);

	return nav;
}
