import type { ILogger } from "@zero-heads-lab/analytics/lib/logger";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { keys } from "./keys";
import * as schema from "./schema";

// biome-ignore lint/suspicious/useAwait: No awaited ca;;
export async function createDatabase(
	url: string = keys.DATABASE_URL,
	logger?: ILogger
) {
	if (typeof window !== "undefined") {
		throw new Error("Database can be used in server only");
	}

	const client = postgres(url, {
		prepare: false,
		max: 1,
		idle_timeout: 20,
		connect_timeout: 10,
		fetch_types: false,
	});

	return drizzle(client, {
		schema,
		logger: logger
			? {
					logQuery(query, params) {
						// This logger carries the context (rayId/traceId) set in middleware
						logger.info("database.query", { query, params });
					},
				}
			: false, // Disable default logging if no logger provided
	});
}

export type Database = Awaited<ReturnType<typeof createDatabase>>;
