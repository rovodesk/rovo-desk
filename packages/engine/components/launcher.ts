import type { ChatbotEngine } from "core/engine";
import type { BotState } from "types";

export function createLauncher(
	state: BotState,
	engine: ChatbotEngine<BotState>
) {
	const btn = document.createElement("button");
	btn.className = "zh-widget-launcher";

	Object.assign(btn.style, {
		position: "fixed",
		bottom: "24px",
		right: "24px",
		zIndex: "1000",
		width: "56px",
		height: "56px",
		borderRadius: "50%",
		border: "none",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "linear-gradient(135deg, #6366f1, #4f46e5)",
		color: "#ffffff",
		boxShadow:
			"0 10px 25px rgba(79, 70, 229, 0.35), 0 4px 10px rgba(0,0,0,0.15)",
		transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
	});

	// Hover effect
	btn.onmouseenter = () => {
		btn.style.transform = "translateY(-3px) scale(1.05)";
	};
	btn.onmouseleave = () => {
		btn.style.transform = "translateY(0) scale(1)";
	};

	const iconWrapper = document.createElement("div");
	iconWrapper.style.transition = "transform 0.25s ease, opacity 0.2s ease";
	iconWrapper.style.display = "flex";

	const renderIcon = () => {
		iconWrapper.innerHTML = "";

		if (state.isOpen) {
			// Chevron Down / Close
			iconWrapper.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      `;
			iconWrapper.style.transform = "rotate(90deg)";
		} else {
			// Chat Icon
			iconWrapper.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      `;
			iconWrapper.style.transform = "rotate(0deg)";
		}
	};

	renderIcon();

	btn.appendChild(iconWrapper);

	btn.onclick = () => {
		state.isOpen ? engine.dispatch(["close"]) : engine.dispatch(["open"]);
	};

	return btn;
}
