import {
	IconBrandReact,
	IconBrandReactNative,
	IconBrandShopee,
	IconBrandWhatsappFilled,
	IconBrandWix,
	IconBrandWordpress,
	type TablerIcon,
} from "@tabler/icons-react";

type Connection = {
	label: string;
	icon: TablerIcon;
	type: "CLIENT" | "SERVER";
	source: "url" | "email" | "phone";
};

export const CONNECTION_MAP: Record<string, Connection> = {
	whatsapp: {
		label: "WhatsApp",
		icon: IconBrandWhatsappFilled,
		type: "SERVER",
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
		type: "SERVER",
		source: "url",
	},
	wordpress: {
		label: "WordPress",
		icon: IconBrandWordpress,
		type: "SERVER",
		source: "url",
	},
	wix: {
		label: "Wix",
		icon: IconBrandWix,
		type: "SERVER",
		source: "url",
	},
};

export const CONNECTIONS = Object.keys(CONNECTION_MAP);
export type ConnectionKey = keyof typeof CONNECTION_MAP;

export type SourceType = (typeof CONNECTION_MAP)[ConnectionKey]["source"];
export type ConnectionType = (typeof CONNECTION_MAP)[ConnectionKey]["type"];
export type ConnectionIconType = (typeof CONNECTION_MAP)[ConnectionKey]["icon"];
