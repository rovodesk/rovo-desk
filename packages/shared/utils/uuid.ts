export function generateUUID(prefix?: string) {
	return `${prefix || ""}${globalThis.crypto.randomUUID()}`;
}
