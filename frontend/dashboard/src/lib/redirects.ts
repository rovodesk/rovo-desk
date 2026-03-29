import { extractOrigins } from "@zero-heads-lab/shared/utils";
import { env } from "@/env";

export function safelyRedirectTo(url: string): string {
	const allowedRedirects = extractOrigins(env.VITE_ALLOWED_REDIRECT_TO_URLS);
	try {
		const parsed = new URL(url);
		return allowedRedirects.includes(`${parsed.origin}`)
			? url
			: env.VITE_SIGN_IN_CALLBACK_URL;
	} catch {
		return env.VITE_SIGN_IN_CALLBACK_URL;
	}
}
