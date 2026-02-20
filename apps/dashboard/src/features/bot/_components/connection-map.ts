import {
	IconBrandReact,
	IconBrandReactNative,
	IconBrandShopee,
	IconBrandWhatsappFilled,
	IconBrandWix,
	IconBrandWordpress,
	type TablerIcon,
} from "@tabler/icons-react";

type ConnectionIcon = {
	label: string;
	icon: TablerIcon;
	type: "CLIENT" | "SERVER" | "PLUGIN";
	source: "url" | "email" | "phone";
};

export const CONNECTION_ICONS_MAP: Record<string, ConnectionIcon> = {
	whatsapp: {
		label: "WhatsApp",
		icon: IconBrandWhatsappFilled,
		type: "PLUGIN",
		source: "phone",
	},
	react: {
		label: "React",
		icon: IconBrandReact,
		type: "CLIENT",
		source: "url",
	},
	reactNative: {
		label: "React Native",
		icon: IconBrandReactNative,
		type: "CLIENT",
		source: "url",
	},
	shopify: {
		label: "Shopify",
		icon: IconBrandShopee,
		type: "PLUGIN",
		source: "url",
	},
	wordpress: {
		label: "WordPress",
		icon: IconBrandWordpress,
		type: "PLUGIN",
		source: "url",
	},
	wix: {
		label: "Wix",
		icon: IconBrandWix,
		type: "PLUGIN",
		source: "url",
	},
};

export const CONNECTIONS = Object.keys(CONNECTION_ICONS_MAP);
export type ConnectionIconKey = keyof typeof CONNECTION_ICONS_MAP;

export type SourceType =
	(typeof CONNECTION_ICONS_MAP)[ConnectionIconKey]["source"];

export type ConnectionType =
	(typeof CONNECTION_ICONS_MAP)[ConnectionIconKey]["type"];
