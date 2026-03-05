/** biome-ignore-all lint/suspicious/noExplicitAny: Add types later */
import { extractOrigins } from "@zero-heads-lab/shared/utils";
import type { Context } from "hono";
import type { z } from "zod";
import type { Bindings } from "../types";

export const getAllowedOrigins = (c: Context<{ Bindings: Bindings }>) => {
	return extractOrigins(c.env.ALLOWED_ORIGINS);
};

export async function validateJson<T extends z.ZodTypeAny>(
	c: Context,
	schema: T
) {
	const body = await c.req.json().catch(() => null);

	if (!body) {
		return {
			ok: false as const,
			response: c.json({ error: "Invalid JSON body" }, 400),
		};
	}

	const parsed = schema.safeParse(body);

	if (!parsed.success) {
		return {
			ok: false as const,
			response: c.json(
				{
					error: "Validation failed",
					issues: parsed.error.flatten(),
				},
				400
			),
		};
	}

	return {
		ok: true as const,
		data: parsed.data,
	};
}
