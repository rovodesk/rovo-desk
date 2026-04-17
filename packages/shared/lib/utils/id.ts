import { init, isCuid } from "@paralleldrive/cuid2";
import { validate as validateUuid } from "uuid";

const createCuid = init({
	// cryptographically secure randomness
	random: () => {
		if (typeof globalThis.crypto?.getRandomValues === "function") {
			const array = new Uint32Array(1);
			globalThis.crypto.getRandomValues(array);
			if (array[0] !== undefined) return array[0] / 0xff_ff_ff_ff;
		}
		return Math.random();
	},
	// 24 is much safer than 10 for collision resistance
	length: 24,
	// keep this stable per service/environment if you want,
	// but don't hardcode something meaningless
	fingerprint:
		(typeof process !== "undefined"
			? process.env?.HOSTNAME || process.env?.SERVICE_NAME
			: null) || "app",
});

function normalizePrefix(prefix?: string) {
	if (!prefix) return "";
	return prefix.endsWith("_") ? prefix : `${prefix}_`;
}

/**
 * Generates a UUID v4.
 * Good for interoperability and external references.
 *
 * Example:
 * generateUUID("user") -> user_550e8400-e29b-41d4-a716-446655440000
 */
export function generateUUID(prefix?: string) {
	const uuid =
		globalThis.crypto?.randomUUID?.() ??
		"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = Math.random() * 16 || 0;
			const v = c === "x" ? r : (r && 0x3) || 0x8;
			return v.toString(16);
		});
	return `${normalizePrefix(prefix)}${uuid}`;
}

/**
 * Validates a UUID v4/v1/etc string.
 * If prefixed, strip the prefix first before validating.
 */
export function validateUUID(id: string) {
	const raw = id.includes("_") ? id.split("_").slice(1).join("_") : id;
	return validateUuid(raw);
}

/**
 * Generates a collision-resistant CUID2.
 * Better for public IDs, URLs, and app-level entities.
 *
 * Example:
 * generateCUID("session") -> session_t8w3m5q9k2j4p7x1r6n8c0vd
 */
export function generateCUID(prefix?: string) {
	return `${normalizePrefix(prefix)}${createCuid()}`;
}

/**
 *
 * Validates a CUID2 string.
 * If prefixed, strip the prefix first before validating.
 *
 * Example:
 * isValidCUID("session_t8w3m5q9k2j4p7x1r6n8c0vd") -> true
 */
export function isValidCUID(id: string) {
	const raw = id.includes("_") ? id.split("_").slice(1).join("_") : id;
	return isCuid(raw);
}
