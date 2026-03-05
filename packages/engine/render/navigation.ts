import { capitalize } from "@zero-heads-lab/shared/utils";
import type { ChatbotEngine } from "../core/engine";
import type { BotState, Mode } from "../types";

export function createNavigation(
	state: BotState,
	engine: ChatbotEngine<BotState>
) {
	const nav = document.createElement("div");

	const theme = state.config?.theme;

	Object.assign(nav.style, {
		padding: "12px 16px 16px",
		background: theme?.backgroundColor ?? "#0f172a",
		borderTop: "1px solid rgba(255,255,255,0.06)",
	});

	const inner = document.createElement("div");

	Object.assign(inner.style, {
		display: "flex",
		gap: "8px",
	});

	const modes: Mode[] = ["visitor", "user"];

	modes.forEach((mode) => {
		const isActive = state.mode === mode;

		const btn = document.createElement("button");
		btn.textContent = capitalize(mode);

		Object.assign(btn.style, {
			flex: "1",
			padding: "9px 12px",
			borderRadius: "10px",
			border: "none",
			cursor: "pointer",
			fontSize: "13px",
			fontWeight: isActive ? "600" : "500",
			background: isActive ? (theme?.primaryColor ?? "#2563eb") : "transparent",
			color: isActive ? "#fff" : "#94a3b8",
			transition: "all 0.15s ease",
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

		btn.onclick = () => {
			engine.setMode(mode);
		};

		inner.appendChild(btn);
	});

	nav.appendChild(inner);

	return nav;
}
