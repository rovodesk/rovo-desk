import { generateUUID } from "@zero-heads-lab/shared/lib/utils";
import { extractOrigins } from "@zero-heads-lab/shared/lib/utils/extract-origins";
import type { Context } from "hono";
import type { SecretLike } from "@/types";

export const getAllowedOrigins = (c: Context) => {
	return extractOrigins(c.env.ALLOWED_ORIGINS || "");
};

export function getSpanID(c: Context) {
	return (
		c.req.header("cf-ray") || `${c.env.WORKER_ENV}-${generateUUID("span-")}`
	);
}

export async function resolveSecret(
	value: SecretLike
): Promise<string | undefined> {
	if (!value) return undefined;

	// LOCAL DEV → string
	if (typeof value === "string") return value;

	// PROD → secrets store
	if (typeof value.get === "function") return await value.get();

	return undefined;
}
