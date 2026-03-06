import type { Component } from "core/component-registry";

export const welcomeCTAComponent: Component = {
	tab: "welcome",
	render({ actionProvider }) {
		const cta = document.createElement("button");
		cta.innerHTML = `
    <span>Send us a message</span>
    <span style="font-size:18px;">→</span>
  `;

		Object.assign(cta.style, {
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
			transition: "all 0.2s ease",
		});

		cta.onmouseenter = () => {
			cta.style.background = "rgba(255,255,255,0.08)";
		};

		cta.onmouseleave = () => {
			cta.style.background = "rgba(255,255,255,0.04)";
		};

		cta.onclick = () => actionProvider.navigate("conversation");

		return cta;
	},
};
