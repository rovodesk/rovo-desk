/** biome-ignore-all lint/suspicious/noExplicitAny: Error can be of any type */

export function getErrorStatus(error: unknown): number | null {
	if (typeof error !== "object" || error === null) return null;

	if ("status" in error && typeof (error as any).status === "number") {
		return (error as any).status;
	}

	if (
		"response" in error &&
		typeof (error as any).response?.status === "number"
	) {
		return (error as any).response.status;
	}

	return null;
}
