import type { Component } from "core/component-registry";

export const welcomeHeaderComponent: Component = {
	tab: "welcome",
	render({ actionProvider }) {
		const header = document.createElement("div");
		Object.assign(header.style, {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "14px 16px",
			background: "transparent",
		});

		const logo = document.createElement("div");
		Object.assign(logo.style, {
			width: "36px",
			height: "36px",
			borderRadius: "10px",
			background: "rgba(255,255,255,0.08)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#fff",
			fontWeight: "600",
		});
		logo.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  `;

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
			background: "transparent",
			border: "none",
			cursor: "pointer",
			color: "#ffffff",
			padding: "6px",
			borderRadius: "8px",
		});

		close.onclick = () => actionProvider.close();

		header.append(logo, close);

		return header;
	},
};
