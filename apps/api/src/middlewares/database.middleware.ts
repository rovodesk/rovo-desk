import { createDatabase } from "@zero-heads-lab/database";
import type { MiddlewareHandler } from "hono";
import type { Bindings, Variables } from "../types";

export const databaseMiddleware: MiddlewareHandler<{
	Bindings: Bindings;
	Variables: Variables;
}> = async (c, next) => {
	const logger = c.get("LOGGER");
	const { db } = await createDatabase(c.env.DATABASE_URL, logger);

	c.set("DATABASE", db);

	await next(); // ✅ correct
};
