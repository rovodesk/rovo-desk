import type { BotState, IUpdater, View } from "../types";

export function createNewsView(_state: BotState, updater: IUpdater): View {
	return {
		header: createNewsHeader(updater),
		content: createNewsInnerContainer(),
	};
}

export function createNewsHeader(updater: IUpdater): HTMLElement {
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

	header.textContent = "News";

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

export function createNewsInnerContainer(): HTMLElement {
	const container = document.createElement("div");

	Object.assign(container.style, {
		display: "flex",
		flexDirection: "column",
		gap: "20px",
		padding: "20px",
		overflowY: "auto",
		flex: "1",
		background: "#0f172a",
	});

	// ===== Latest Section =====
	const latestRow = document.createElement("div");
	Object.assign(latestRow.style, {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	});

	const latestText = document.createElement("div");
	latestText.innerHTML = `
    <div style="font-size:18px;font-weight:600;color:#fff;">Latest</div>
    <div style="font-size:14px;color:#94a3b8;margin-top:4px;">
      From Team Intercom
    </div>
  `;

	const avatars = document.createElement("div");
	Object.assign(avatars.style, {
		display: "flex",
	});

	["#6366f1", "#8b5cf6", "#22c55e"].forEach((color, i) => {
		const avatar = document.createElement("div");
		Object.assign(avatar.style, {
			width: "36px",
			height: "36px",
			borderRadius: "50%",
			background: color,
			border: "2px solid #0f172a",
			marginLeft: i === 0 ? "0" : "-10px",
		});
		avatars.appendChild(avatar);
	});

	latestRow.append(latestText, avatars);

	// ===== News Card =====
	const card = document.createElement("div");
	Object.assign(card.style, {
		borderRadius: "20px",
		overflow: "hidden",
		background: "rgba(255,255,255,0.03)",
		border: "1px solid rgba(255,255,255,0.06)",
		cursor: "pointer",
		transition: "all 0.2s ease",
	});

	card.onmouseenter = () => {
		card.style.background = "rgba(255,255,255,0.06)";
	};

	card.onmouseleave = () => {
		card.style.background = "rgba(255,255,255,0.03)";
	};

	const image = document.createElement("div");
	Object.assign(image.style, {
		height: "160px",
		background: "linear-gradient(135deg,#6366f1,#9333ea)",
	});

	const body = document.createElement("div");
	Object.assign(body.style, {
		padding: "16px",
	});

	const tags = document.createElement("div");
	Object.assign(tags.style, {
		display: "flex",
		gap: "8px",
		marginBottom: "10px",
	});

	["Fin", "New feature"].forEach((label) => {
		const pill = document.createElement("div");
		pill.textContent = label;

		Object.assign(pill.style, {
			padding: "4px 10px",
			borderRadius: "999px",
			background: "rgba(255,255,255,0.08)",
			fontSize: "12px",
			color: "#ffffff",
		});

		tags.appendChild(pill);
	});

	const title = document.createElement("div");
	title.textContent =
		"Train Fin to detect key attributes in every conversation";

	Object.assign(title.style, {
		fontSize: "16px",
		fontWeight: "600",
		color: "#ffffff",
		marginBottom: "6px",
	});

	const desc = document.createElement("div");
	desc.textContent =
		"Fin can now automatically detect the attributes you define — like issue type, delivery status, and more.";

	Object.assign(desc.style, {
		fontSize: "14px",
		color: "#94a3b8",
		lineHeight: "1.5",
	});

	body.append(tags, title, desc);
	card.append(image, body);

	container.append(latestRow, card);

	return container;
}
