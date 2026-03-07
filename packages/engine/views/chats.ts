import type { ChatbotEngine } from "../core/engine";
import type { Message } from "../core/message-parser";
import type { BotState, View } from "../types";

const DEFAULT_MESSAGE_LOADING_TIME = 750;

export function createChatView(engine: ChatbotEngine<BotState>): View {
	return {
		header: createChatHeader(engine),
		content: createChatInnerContainer(engine),
	};
}

export const createChatInnerContainer = (
	engine: ChatbotEngine<BotState>
): HTMLElement => {
	const container = document.createElement("div");
	Object.assign(container.style, {
		display: "flex",
		flexDirection: "column",
		flex: "1",
		position: "relative",
		background: `
      radial-gradient(
        circle at top,
        rgba(99,102,241,0.08),
        transparent 40%
      ),
      #0f172a
    `,
	});

	// ===== Messages Area =====
	const messages = createMessageContainer(engine);

	Object.assign(messages.style, {
		padding: "20px 16px",
		scrollBehavior: "smooth",
	});

	// ===== Subtle Top Fade =====
	const topFade = document.createElement("div");
	Object.assign(topFade.style, {
		position: "absolute",
		top: "0",
		left: "0",
		right: "0",
		height: "24px",
		background:
			"linear-gradient(to bottom, rgba(15,23,42,1), rgba(15,23,42,0))",
		pointerEvents: "none",
		zIndex: "2",
	});

	// ===== Subtle Bottom Fade =====
	const bottomFade = document.createElement("div");
	Object.assign(bottomFade.style, {
		position: "absolute",
		bottom: "60px", // just above input
		left: "0",
		right: "0",
		height: "24px",
		background: "linear-gradient(to top, rgba(15,23,42,1), rgba(15,23,42,0))",
		pointerEvents: "none",
		zIndex: "2",
	});

	const form = createForm(engine);

	container.append(topFade, messages, bottomFade, form);

	return container;
};

export function createChatHeader(engine: ChatbotEngine<BotState>): HTMLElement {
	const state = engine.getState();

	const header = document.createElement("div");
	Object.assign(header.style, {
		padding: "14px 16px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		background: "rgba(255,255,255,0.02)",
		borderBottom: "1px solid rgba(255,255,255,0.06)",
		backdropFilter: "blur(8px)",
	});

	// ===== Left Section =====
	const left = document.createElement("div");
	Object.assign(left.style, {
		display: "flex",
		alignItems: "center",
		gap: "12px",
	});

	// Avatar
	const avatar = document.createElement("div");
	Object.assign(avatar.style, {
		width: "36px",
		height: "36px",
		borderRadius: "50%",
		background: "linear-gradient(135deg, #6366f1, #4f46e5)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "14px",
		fontWeight: "600",
		color: "#fff",
		boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
	});
	avatar.textContent = "AI";

	if (state.isElevated) {
		// 👤 Human Avatar
		Object.assign(avatar.style, {
			background: "#1f2937",
		});

		avatar.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="white"
        stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5.5 21a7 7 0 0 1 13 0"/>
      </svg>
    `;
	} else {
		// 🤖 AI Avatar (SVG Logo)
		Object.assign(avatar.style, {
			background: "linear-gradient(135deg, #6366f1, #4f46e5)",
		});

		avatar.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="white"
        stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a7.8 7.8 0 0 0 .1-6"/>
        <path d="M4.6 9a7.8 7.8 0 0 0 0 6"/>
      </svg>
    `;
	}

	// Title Container
	const textContainer = document.createElement("div");
	Object.assign(textContainer.style, {
		display: "flex",
		flexDirection: "column",
	});

	const title = document.createElement("span");
	title.textContent = state.isElevated
		? "Human Support" // TODO: Use real name
		: "AI Assistant";

	Object.assign(title.style, {
		fontSize: "14px",
		fontWeight: "600",
		color: "#ffffff",
	});

	const status = document.createElement("span");
	status.textContent = state.isElevated ? "Connected" : "AI Online";

	Object.assign(status.style, {
		fontSize: "12px",
		color: state.isElevated ? "#22c55e" : "#6366f1",
		opacity: "0.9",
	});

	textContainer.append(title, status);
	left.append(avatar, textContainer);

	/* ================= RIGHT ACTIONS ================= */
	const actions = document.createElement("div");
	Object.assign(actions.style, {
		display: "flex",
		alignItems: "center",
		gap: "10px",
	});

	// ==== Elevate Button =====
	if (!state.isElevated) {
		const elevateBtn = document.createElement("button");
		elevateBtn.innerHTML = state.isElevated ? "Back to AI" : "Elevate";

		Object.assign(elevateBtn.style, {
			background: state.isElevated
				? "rgba(255,255,255,0.06)"
				: "linear-gradient(135deg, #6366f1, #4f46e5)",
			color: "#ffffff",
			border: "none",
			padding: "8px 14px",
			fontSize: "12px",
			fontWeight: "600",
			borderRadius: "999px",
			cursor: "pointer",
			transition: "all 0.2s ease",
			boxShadow: state.isElevated ? "none" : "0 10px 25px rgba(79,70,229,0.35)",
		});

		elevateBtn.onmouseenter = () => {
			elevateBtn.style.transform = "translateY(-1px)";
			elevateBtn.style.boxShadow = "0 14px 30px rgba(79,70,229,0.45)";
		};

		elevateBtn.onmouseleave = () => {
			elevateBtn.style.transform = "translateY(0)";
			elevateBtn.style.boxShadow = state.isElevated
				? "none"
				: "0 10px 25px rgba(79,70,229,0.35)";
		};

		elevateBtn.onclick = () =>
			engine.setState((prev) => ({
				...prev,
				isElevated: !prev.isElevated,
			}));

		actions.append(elevateBtn);
	}

	// ===== Close Button =====
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
		color: "#94a3b8",
		padding: "6px",
		borderRadius: "8px",
		transition: "all 0.2s ease",
	});

	close.onmouseenter = () => {
		close.style.background = "rgba(255,255,255,0.06)";
		close.style.color = "#ffffff";
	};

	close.onmouseleave = () => {
		close.style.background = "transparent";
		close.style.color = "#94a3b8";
	};

	close.onclick = () => engine.setState((prev) => ({ ...prev, isOpen: false }));

	actions.append(close);
	header.append(left, actions);

	return header;
}

const createMessageContainer = (
	engine: ChatbotEngine<BotState>
): HTMLElement => {
	const container = document.createElement("div");
	const { messages } = engine.getState();

	Object.assign(container.style, {
		flex: "1",
		overflowY: "auto",
		padding: "16px",
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	});

	messages.forEach((payload) => {
		if (payload.type === "bot") {
			container.appendChild(createBotChatMessage(payload, engine));
		} else {
			container.appendChild(createUserChatMessage(payload));
		}
	});

	container.scrollTop = container.scrollHeight;

	return container;
};

const createForm = (engine: ChatbotEngine<BotState>): HTMLElement => {
	const container = document.createElement("div");

	Object.assign(container.style, {
		padding: "14px",
		borderTop: "1px solid rgba(255,255,255,0.06)",
		background: "#0f172a",
	});

	const form = document.createElement("form");

	Object.assign(form.style, {
		position: "relative",
	});

	// ===== Input Wrapper (modern pill) =====
	const inputWrapper = document.createElement("div");

	Object.assign(inputWrapper.style, {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		padding: "10px 14px",
		borderRadius: "24px",
		background: "rgba(255,255,255,0.06)",
		border: "1px solid rgba(255,255,255,0.08)",
		backdropFilter: "blur(10px)",
		transition: "all 0.2s ease",
	});

	// ===== Attachment Icon (Left) =====
	const attachment = document.createElement("div");
	attachment.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a1.5 1.5 0 01-2.12-2.12l8.49-8.48"/>
    </svg>
  `;
	Object.assign(attachment.style, {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#94a3b8",
		cursor: "pointer",
	});

	// ===== Input =====
	const input = document.createElement("input");

	Object.assign(input.style, {
		flex: "1",
		background: "transparent",
		border: "none",
		outline: "none",
		color: "#ffffff",
		fontSize: "14px",
	});

	input.placeholder = "Write a message...";

	// ===== Send Icon (Right inside input) =====
	const send = document.createElement("button");
	send.type = "submit";

	send.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M22 2L11 13"></path>
      <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
    </svg>
  `;

	Object.assign(send.style, {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		background: "transparent",
		border: "none",
		cursor: "pointer",
		color: "#6366f1",
		transition: "transform 0.15s ease, opacity 0.2s ease",
	});

	// Hover effect
	send.onmouseenter = () => {
		send.style.transform = "scale(1.1)";
	};
	send.onmouseleave = () => {
		send.style.transform = "scale(1)";
	};

	// Focus glow
	input.onfocus = () => {
		inputWrapper.style.border = "1px solid rgba(99,102,241,0.6)";
		inputWrapper.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
	};

	input.onblur = () => {
		inputWrapper.style.border = "1px solid rgba(255,255,255,0.08)";
		inputWrapper.style.boxShadow = "none";
	};

	const userId = crypto.randomUUID();

	// ===== Submit Logic =====
	form.onsubmit = async (e) => {
		e.preventDefault();

		if (!input.value.trim()) return;

		await engine.handleUserMessage(input.value, { userId });

		input.value = "";
	};

	inputWrapper.append(attachment, input, send);
	form.appendChild(inputWrapper);
	container.appendChild(form);

	return container;
};

const createUserChatMessage = (payload: Message): HTMLElement => {
	const container = document.createElement("div");

	Object.assign(container.style, {
		display: "flex",
		justifyContent: "flex-end",
		marginTop: "8px",
	});

	const bubble = document.createElement("div");

	Object.assign(bubble.style, {
		background: "linear-gradient(135deg, #6366f1, #4f46e5)",
		padding: "12px 16px",
		borderRadius: "18px 18px 4px 18px",
		maxWidth: "75%",
		color: "#ffffff",
		fontSize: "14px",
		lineHeight: "1.4",
		wordBreak: "break-word",
		boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
	});

	bubble.textContent = payload.message;

	container.appendChild(bubble);

	return container;
};

const createBotChatMessage = (
	payload: Message,
	engine: ChatbotEngine<BotState>
): HTMLElement => {
	const { message, widget, loading, id } = payload;

	const outer = document.createElement("div");

	Object.assign(outer.style, {
		display: "flex",
		alignItems: "flex-start",
		gap: "10px",
		marginTop: "12px",
	});

	// ===== Avatar =====
	const avatar = document.createElement("div");

	Object.assign(avatar.style, {
		width: "28px",
		height: "28px",
		borderRadius: "50%",
		background: "linear-gradient(135deg, #6366f1, #4f46e5)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "12px",
		fontWeight: "600",
		color: "#fff",
		flexShrink: "0",
	});

	avatar.textContent = "AI";

	// ===== Bubble =====
	const bubble = document.createElement("div");

	Object.assign(bubble.style, {
		background: "rgba(255,255,255,0.06)",
		padding: "12px 16px",
		borderRadius: "18px 18px 18px 4px",
		maxWidth: "75%",
		fontSize: "14px",
		lineHeight: "1.5",
		color: "#e2e8f0",
		backdropFilter: "blur(8px)",
	});

	if (loading) {
		bubble.appendChild(createLoader());

		setTimeout(() => {
			engine.setState((prev) => ({
				...prev,
				messages: prev.messages.map((msg: Message) =>
					msg.id === id ? { ...msg, loading: false } : msg
				),
			}));
		}, DEFAULT_MESSAGE_LOADING_TIME);
	} else {
		bubble.textContent = message;
	}

	outer.append(avatar, bubble);

	if (widget) {
		const widgetMarkup = engine.getWidget(widget);
		if (widgetMarkup) {
			outer.appendChild(widgetMarkup);
		}
	}

	return outer;
};

const createLoader = (): HTMLElement => {
	const container = document.createElement("div");

	Object.assign(container.style, {
		display: "flex",
		alignItems: "center",
		gap: "6px",
		padding: "8px 4px",
	});

	const createDot = (delay: number) => {
		const dot = document.createElement("div");

		Object.assign(dot.style, {
			width: "6px",
			height: "6px",
			borderRadius: "50%",
			background: "#94a3b8",
			animation: "zh-bounce 1.2s infinite ease-in-out",
			animationDelay: `${delay}ms`,
		});

		return dot;
	};

	container.append(createDot(0), createDot(150), createDot(300));

	// Inject animation once
	if (!document.getElementById("zh-loader-style")) {
		const style = document.createElement("style");
		style.id = "zh-loader-style";
		style.innerHTML = `
      @keyframes zh-bounce {
        0%, 80%, 100% { 
          transform: scale(0.6);
          opacity: 0.4;
        }
        40% { 
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
		document.head.appendChild(style);
	}

	return container;
};
