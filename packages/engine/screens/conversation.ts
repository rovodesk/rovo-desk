import type { Component } from "core/component-registry";

export const conversationCTAComponent: Component = {
	tab: "conversation",

	render({ block, actionProvider }) {
		const button = document.createElement("button");

		button.innerHTML = `
      <span>${block.config.headerTitle}</span>
      <span style="font-size:18px;">→</span>
    `;

		Object.assign(button.style, {
			width: "100%",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "16px 20px",
			borderRadius: "16px",
			border: "1px solid rgba(255,255,255,0.08)",
			background: "rgba(255,255,255,0.04)",
			color: "#ffffff",
			fontSize: "16px",
			cursor: "pointer",
		});

		button.onclick = () => {
			actionProvider.navigate("conversation");
		};

		return button;
	},
};
