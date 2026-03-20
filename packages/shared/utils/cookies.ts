/**
 * Cookie utility functions using manual document.cookie approach
 * Replaces js-cookie dependency for better consistency
 */

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined {
	if (typeof document === "undefined") return undefined;

	const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
	if (match) return match[2];

	return undefined;
}

/**
 * Set a cookie with name, value, and optional parameters
 */
export function setCookie(
	name: string,
	value: string,
	maxAge = DEFAULT_MAX_AGE,
	sameSite: "Lax" | "None" | "Strict" = "Lax",
	secure = typeof window !== "undefined" &&
		window.location.protocol === "https:",
	httpOnly = false
): void {
	if (typeof document === "undefined") return;

	let cookieStr = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=${sameSite};`;
	if (secure) cookieStr += " Secure;";
	if (httpOnly) cookieStr += " HttpOnly;";

	// biome-ignore lint/suspicious/noDocumentCookie: Need here for setting cookies
	document.cookie = cookieStr;
}

/**
 * Remove a cookie by setting its max age to 0
 */
export function removeCookie(name: string): void {
	if (typeof document === "undefined") return;

	// biome-ignore lint/suspicious/noDocumentCookie: Need here for removing cookies
	document.cookie = `${name}=; path=/; max-age=0;`;
}
