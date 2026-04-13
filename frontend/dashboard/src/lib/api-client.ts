import { env } from "@/env";

function stripTrailingSlash(url: string): string {
	return url.replace(/\/+$/, "");
}
function stringLeadingSlash(url: string): string {
	return url.replace(/^\/+/, "");
}

export function baseUrl(path: string): URL {
	return new URL(
		`${stripTrailingSlash(env.VITE_API_BASE_URL)}/${stringLeadingSlash(path)}`
	);
}
