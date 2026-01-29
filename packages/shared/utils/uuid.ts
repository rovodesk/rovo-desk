export function generateUUID(prefix?: string) {
	return `${prefix || ""}${crypto.randomUUID()}`;
}
