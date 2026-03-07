import type { Component } from "core/component-registry";

export const publicationsCardComponent: Component = {
	tab: "publications",

	render() {
		const card = document.createElement("div");

		Object.assign(card.style, {
			margin: "24px 20px",
			borderRadius: "18px",
			overflow: "hidden",
			border: "1px solid rgba(255,255,255,0.06)",
			background: "rgba(255,255,255,0.03)",
		});

		const image = document.createElement("div");

		Object.assign(image.style, {
			height: "160px",
			background: "linear-gradient(135deg,#6366f1,#9333ea)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#fff",
			fontSize: "18px",
			fontWeight: "600",
		});

		image.textContent = "Built For You";

		const body = document.createElement("div");

		Object.assign(body.style, {
			padding: "16px",
		});

		const title = document.createElement("div");
		title.textContent = "A new era of Insights has arrived";

		Object.assign(title.style, {
			fontSize: "16px",
			fontWeight: "600",
			color: "#ffffff",
			marginBottom: "6px",
		});

		const desc = document.createElement("div");
		desc.textContent =
			"We announced our AI-powered product that gives you complete visibility into every conversation.";

		Object.assign(desc.style, {
			fontSize: "14px",
			color: "#94a3b8",
			lineHeight: "1.5",
		});

		body.append(title, desc);

		card.append(image, body);

		return card;
	},
};
