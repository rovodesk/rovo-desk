import type { BotState, IMessageParser, IUpdater, Tab } from "../types";
import { createChatView } from "../views/chats";
import { createConversationsView } from "../views/conversations";
import { createHelpView } from "../views/help.view";
import { createHomeView } from "../views/home.view";
import { createNewsView } from "../views/news.view";
import type WidgetRegistry from "../widget-registry";

type ViewRenderer = (
	state: BotState,
	updater: IUpdater,
	messageParser: IMessageParser,
	widgetRegistry: WidgetRegistry
) => {
	header: HTMLElement;
	content: HTMLElement;
};

const VIEW_MAP: Record<Tab, ViewRenderer> = {
	home: (state, updater) => createHomeView(state, updater),

	chats: (state, updater, messageParser, widgetRegistry) =>
		createChatView(state, updater, messageParser, widgetRegistry),

	conversations: (state, updater) => createConversationsView(state, updater),

	help: (state, updater) => createHelpView(state, updater),

	updates: (state, updater) => createNewsView(state, updater),
};

export function createContent(
	state: BotState,
	messageParser: IMessageParser,
	updater: IUpdater,
	widgetRegistry: WidgetRegistry
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

	const view = renderer(state, updater, messageParser, widgetRegistry);

	Object.assign(view.content.style, {
		flex: "1",
		overflowY: "auto",
	});

	container.append(view.header, view.content);

	return container;
}
