import type { Attributions } from "../types/";

export function getAttributionCookie(name: string) {
	const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
	return match ? decodeURIComponent(match[2] ?? "") : null;
}

export const searchAttributions = (search: string): Attributions => {
	const params = new URLSearchParams(search);

	const attributions = {
		utm_source: params.get("utm_source"),
		utm_medium: params.get("utm_medium"),
		utm_campaign: params.get("utm_campaign"),
		utm_term: params.get("utm_term"),
		utm_content: params.get("utm_content"),
		gclid: params.get("gclid"),
		fbclid: params.get("fbclid"),
		referrer: document.referrer || null,
		timestamp: new Date(),
	};

	return attributions;
};

export const setAttributionCookie = (attributions: Attributions) => {
	// biome-ignore lint/suspicious/noDocumentCookie: Safe fo frontend
	document.cookie = `attributions=${JSON.stringify(attributions)}; path=/; max-age=${60 * 60 * 24 * 30}`;
};

const raw = getAttributionCookie("attributions");
const attribution = raw ? JSON.parse(raw) : null;
console.log(attribution);
