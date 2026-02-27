import type { Tab } from "../types";

type ViewConfig = {
	title: string;
	showClose?: boolean;
	showBack?: boolean;
};

export const VIEWS_CONFIG: Record<Tab, ViewConfig> = {
	home: {
		title: "Home",
		showClose: true,
	},
	conversations: {
		title: "Conversations",
		showClose: false,
	},
	chats: {
		title: "Chats",
		showClose: false,
		showBack: true,
	},
	help: {
		title: "Help Center",
		showClose: false,
	},
	updates: {
		title: "Updates",
		showClose: false,
	},
};
