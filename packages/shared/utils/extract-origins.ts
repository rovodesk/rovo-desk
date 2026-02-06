export function extractOrigins(origins: string) {
	return origins
		.trim()
		.split(",")
		.map((o) => o.trim())
		.filter((o) => o !== "");
}
