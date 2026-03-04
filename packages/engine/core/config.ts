import type { Message } from "./message-parser.js";

export interface ChatbotConfig {
	organizationId: string;
	accessKey: string;
	apiBaseUrl?: string;

	user?: {
		id: string;
		name: string;
		email: string;
		createdAt: string;
		signature: string;
	};

	chatbot?: ChatbotOptions;
	display?: DisplayOptions;
	advanced?: AdvancedOptions;
}

export interface ChatbotOptions {
	welcomeMessages?: Message[];
	avatarUrl?: string;
}

export interface DisplayOptions {
	theme?: "dark" | "light" | "system";
	logoUrl?: string;
	alignment?: Alignment;
	offset?: {
		horizontal?: number;
		vertical?: number;
	};
	defaultOpen?: boolean;
}

export type Alignment =
	| "bottom-right"
	| "bottom-left"
	| "top-right"
	| "top-left";

export interface AdvancedOptions {
	home?: HomeConfig;
	navigation?: NavigationConfig;
	streaming?: boolean;
}

export interface HomeConfig {
	displaySearch?: boolean;
	blocks?: HomeBlock[];
}

export interface HomeBlock {
	image?: {
		src: string;
		alt?: string;
	};
	title?: string;
	description?: string;
	url?: string;
}

export interface NavigationConfig {
	pages?: NavigationPage[];
}

export interface NavigationPage {
	icon?: string;
	label?: string;
	viewId?: string;
}
