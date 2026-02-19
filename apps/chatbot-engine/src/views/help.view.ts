import type { BotState, IUpdater, View } from "../types";

export function createHelpView(_state: BotState, _updater: IUpdater): View {
	return {
		header: createHelpHeader(_updater),
		content: createHelpInnerContainer(),
	};
}

function createHelpHeader(updater: IUpdater): HTMLElement {
	const header = document.createElement("div");

	Object.assign(header.style, {
		position: "relative",
		padding: "18px 16px",
		borderBottom: "1px solid rgba(255,255,255,0.06)",
		textAlign: "center",
		fontSize: "18px",
		fontWeight: "600",
		color: "#ffffff",
	});

	header.textContent = "Help";

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
		position: "absolute",
		right: "16px",
		top: "50%",
		transform: "translateY(-50%)",
		background: "transparent",
		border: "none",
		cursor: "pointer",
		color: "#94a3b8",
	});

	close.onclick = () => updater((prev) => ({ ...prev, isOpen: false }));

	header.appendChild(close);

	return header;
}

function createHelpInnerContainer(): HTMLElement {
	const container = document.createElement("div");
	Object.assign(container.style, {
		display: "flex",
		flexDirection: "column",
		flex: "1",
		overflowY: "auto",
		overflowX: "hidden",
		padding: "20px",
		gap: "20px",
		background: "#0f172a",
		boxSizing: "border-box",
		minWidth: "0",
	});

	// ===== Search =====
	const searchWrapper = document.createElement("div");

	Object.assign(searchWrapper.style, {
		position: "relative",
	});

	const input = document.createElement("input");
	input.placeholder = "Search for help";
	Object.assign(input.style, {
		width: "100%",
		padding: "14px 40px 14px 16px",
		borderRadius: "14px",
		border: "none",
		background: "rgba(255,255,255,0.06)",
		color: "#ffffff",
		fontSize: "14px",
		outline: "none",
		boxSizing: "border-box",
		minWidth: "0",
	});

	const icon = document.createElement("div");
	icon.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.3-4.3"/>
    </svg>
  `;

	Object.assign(icon.style, {
		position: "absolute",
		right: "14px",
		top: "50%",
		transform: "translateY(-50%)",
		color: "#94a3b8",
	});

	searchWrapper.append(input, icon);

	// ===== Collections Label =====
	const collectionsLabel = document.createElement("div");
	collectionsLabel.textContent = "15 collections";

	Object.assign(collectionsLabel.style, {
		fontSize: "20px",
		fontWeight: "600",
		color: "#ffffff",
		marginTop: "10px",
	});

	// ===== Collection List =====
	const collections = [
		{
			title: "Intercom Overview",
			desc: "See how your AI-first customer service solution works.",
			articles: "24 articles",
		},
		{
			title: "Getting Started",
			desc: "Everything you need to know to get started with Intercom.",
			articles: "31 articles",
		},
		{
			title: "Fin AI Agent",
			desc: "Resolving customer questions instantly and accurately.",
			articles: "90 articles",
		},
		{
			title: "Channels",
			desc: "Enabling the channels you use to communicate with customers.",
			articles: "18 articles",
		},
	];

	collections.forEach((item, index) => {
		const row = document.createElement("div");
		Object.assign(row.style, {
			padding: "16px 0",
			borderBottom:
				index === collections.length - 1
					? "none"
					: "1px solid rgba(255,255,255,0.06)",
			cursor: "pointer",
			minWidth: "0",
		});

		const topRow = document.createElement("div");
		Object.assign(topRow.style, {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			gap: "8px",
			minWidth: "0",
		});

		const title = document.createElement("div");
		title.textContent = item.title;

		Object.assign(title.style, {
			fontSize: "16px",
			fontWeight: "600",
			color: "#ffffff",
		});

		const arrow = document.createElement("div");
		arrow.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    `;
		arrow.style.color = "#94a3b8";

		topRow.append(title, arrow);

		const desc = document.createElement("div");
		desc.textContent = item.desc;

		Object.assign(desc.style, {
			fontSize: "14px",
			color: "#cbd5e1",
			marginTop: "6px",
			lineHeight: "1.5",
		});

		const articles = document.createElement("div");
		articles.textContent = item.articles;

		Object.assign(articles.style, {
			fontSize: "13px",
			color: "#94a3b8",
			marginTop: "6px",
		});

		row.append(topRow, desc, articles);
		container.appendChild(row);
	});

	container.prepend(collectionsLabel);
	container.prepend(searchWrapper);

	return container;
}
