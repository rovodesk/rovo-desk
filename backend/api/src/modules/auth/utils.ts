import crypto from "node:crypto";
import { APIError } from "encore.dev/api";
import {
	AuthConfig,
	type TrustedSocialProvider,
} from "@/src/modules/auth/auth.config";

export function randomString(length = 64): string {
	const charset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
	const bytes = crypto.getRandomValues(new Uint8Array(length));
	return Array.from(bytes, (b) => charset[b % charset.length]).join("");
}

export async function createCodeChallenge(
	codeVerifier: string
): Promise<string> {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return base64UrlEncode(digest);
}

function base64UrlEncode(buffer: ArrayBuffer): string {
	return Buffer.from(buffer)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

export function sha256(input: string): Buffer {
	return crypto.createHash("sha256").update(input).digest();
}

export function createCodeVerifier(): string {
	return randomString(64);
}

export function createState(): string {
	return randomString(32);
}

export function createSessionId(): string {
	return randomString(48);
}

export function validateReturnTo(returnTo?: string): string | undefined {
	if (!returnTo) return undefined;

	let parsed: URL;

	try {
		parsed = new URL(returnTo);
	} catch {
		throw APIError.invalidArgument("Invalid returnTo URL");
	}

	const allowedOrigins: readonly string[] = AuthConfig.allowedRedirects;

	if (!allowedOrigins.includes(parsed.origin)) {
		throw APIError.invalidArgument("Unapproved redirect origin");
	}

	return returnTo;
}

const providerOverrides: Partial<Record<TrustedSocialProvider, string>> = {
	github: "GitHub",
};

export function capitalize(data: string): string {
	if (!data) return data;
	return data.charAt(0).toUpperCase() + data.slice(1);
}

export function mapProviderToCognito(provider: TrustedSocialProvider): string {
	return providerOverrides[provider] ?? capitalize(provider);
}

export function parseJwt(token: string): any {
	const payload = token.split(".")[1];
	return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}
