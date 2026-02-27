import type { ChatbotEngine } from "../core/engine";
import type { BotState, Tab } from "../types";
import { createChatView } from "../views/chats";
import { createConversationsView } from "../views/conversations";
import { createHelpView } from "../views/help.view";
import { createHomeView } from "../views/home.view";
import { createNewsView } from "../views/news.view";

type ViewRenderer = (engine: ChatbotEngine<BotState>) => {
	header: HTMLElement;
	content: HTMLElement;
};

const VIEW_MAP: Record<Tab, ViewRenderer> = {
	home: (engine) => createHomeView(engine),

	chats: (engine) => createChatView(engine),

	conversations: (engine) => createConversationsView(engine),

	help: (engine) => createHelpView(engine),

	updates: (engine) => createNewsView(engine),
};

export function createContent(
	state: BotState,
	engine: ChatbotEngine<BotState>
) {
	const container = document.createElement("div");

	Object.assign(container.style, {
		display: "flex",
		flexDirection: "column",
		flex: "1",
		overflow: "hidden",
		background: "#0f172a",
		color: "#ffffff",
	});

	const renderer = VIEW_MAP[state.activeTab];

	if (!renderer) {
		throw new Error(`No view found for tab: ${state.activeTab}`);
	}

	const view = renderer(engine);

	Object.assign(view.content.style, {
		flex: "1",
		overflowY: "auto",
	});

	container.append(view.header, view.content);

	return container;
}
