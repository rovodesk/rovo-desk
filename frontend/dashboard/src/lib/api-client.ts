import { env } from "@/env";

function stripTrailingSlash(url: string): string {
	return url.replace(/\/+$/, "");
}
function stripLeadingSlash(url: string): string {
	return url.replace(/^\/+/, "");
}

export function baseUrl(path: string): URL {
	return new URL(
		`${stripTrailingSlash(env.VITE_API_BASE_URL)}/${stripLeadingSlash(path)}`
	);
}
