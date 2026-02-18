import type { BotState, IUpdater, View } from "../types";

export function createHomeView(_state: BotState, updater: IUpdater): View {
	return {
		header: createHomeHeader(updater),
		content: createHomeInnerContainer(updater),
	};
}

export function createHomeInnerContainer(updater: IUpdater): HTMLElement {
	const container = document.createElement("div");

	Object.assign(container.style, {
		display: "flex",
		flexDirection: "column",
		flex: "1",
		overflowY: "auto",
		background: `
      radial-gradient(
        circle at top left,
        rgba(99,102,241,0.15),
        transparent 50%
      ),
      #0f172a
    `,
	});

	// ===== Hero Section =====
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

	// ===== CTA Button =====
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

	cta.onclick = () =>
		updater((prev) => ({
			...prev,
			activeTab: "conversations",
		}));

	hero.append(title, subtitle, cta);

	// ===== Card Section =====
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
		background: "linear-gradient(135deg, #6366f1, #9333ea)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#fff",
		fontSize: "18px",
		fontWeight: "600",
	});

	image.textContent = "Built For You";

	const cardBody = document.createElement("div");
	Object.assign(cardBody.style, {
		padding: "16px",
	});

	const cardTitle = document.createElement("div");
	cardTitle.textContent = "A new era of Insights has arrived";
	Object.assign(cardTitle.style, {
		fontSize: "16px",
		fontWeight: "600",
		color: "#ffffff",
		marginBottom: "6px",
	});

	const cardDesc = document.createElement("div");
	cardDesc.textContent =
		"We announced our AI-powered product that gives you complete visibility into every conversation.";
	Object.assign(cardDesc.style, {
		fontSize: "14px",
		color: "#94a3b8",
		lineHeight: "1.5",
	});

	cardBody.append(cardTitle, cardDesc);
	card.append(image, cardBody);

	container.append(hero, card);

	return container;
}

export function createHomeHeader(updater: IUpdater): HTMLElement {
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

	close.onclick = () => updater((prev) => ({ ...prev, isOpen: false }));

	header.append(logo, close);

	return header;
}
