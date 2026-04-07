import { randomBytes, randomUUID } from "node:crypto";
import { init, isCuid } from "@paralleldrive/cuid2";
import { validate as validateUuid } from "uuid";

const createCuid = init({
	// cryptographically secure randomness
	random: () => {
		return randomBytes(4).readUInt32BE(0) / 0xff_ff_ff_ff;
	},
	// 24 is much safer than 10 for collision resistance
	length: 24,
	// keep this stable per service/environment if you want,
	// but don't hardcode something meaningless
	fingerprint: process.env.HOSTNAME || process.env.SERVICE_NAME || "app",
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
	return `${normalizePrefix(prefix)}${randomUUID()}`;
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
