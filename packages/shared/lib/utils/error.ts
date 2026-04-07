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

export function normalizeError(err: unknown) {
	if (err instanceof Error) {
		return {
			message: err.message,
			name: err.name,
			stack: err.stack,
		};
	}

	return {
		message: String(err),
	};
}

export type ErrorModel = {
	error: {
		code: string | number;
		traceId: string;
		message: string;
		timestamp: string;
		path?: string;
		context?: string;
	};
};
