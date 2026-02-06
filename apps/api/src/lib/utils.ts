import { extractOrigins } from "@zero-heads-lab/shared/utils";
import type { Context } from "hono";
import type { Bindings } from "../types";

export const getAllowedOrigins = (c: Context<{ Bindings: Bindings }>) => {
	return extractOrigins(c.env.ALLOWED_ORIGINS);
};
