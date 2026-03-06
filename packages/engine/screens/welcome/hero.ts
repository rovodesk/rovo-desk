import type { Component } from "core/component-registry";

export const welcomeHeroComponent: Component = {
	tab: "welcome",
	render() {
		const hero = document.createElement("div");
		Object.assign(hero.style, {
			padding: "32px 20px 20px",
		});

		const title = document.createElement("h1");
		title.textContent = "Hello there.";
		Object.assign(title.style, {
			fontSize: "26px",
			fontWeight: "600",
			margin: "0",
			color: "#94a3b8",
		});

		const subtitle = document.createElement("h2");
		subtitle.textContent = "How can we help?";
		Object.assign(subtitle.style, {
			fontSize: "28px",
			fontWeight: "700",
			margin: "6px 0 24px",
			color: "#ffffff",
		});

		hero.append(title, subtitle);

		return hero;
	},
};
