import type { ILogger } from "@zero-heads-lab/analytics/lib/logger";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schemas";

export type Database = PostgresJsDatabase<
	typeof import("/Users/dev/Desktop/SAAS/RovoDesk/rovodesk/packages/database/drizzle/schemas/index")
>;

// biome-ignore lint/suspicious/noExplicitAny: Can't find a way to type this
export type DatabaseClient = postgres.Sql<any>;

// biome-ignore lint/suspicious/useAwait: No awaited ca;;
export async function createDatabase(
	url: string,
	logger?: ILogger
): Promise<{
	db: Database;
	client: DatabaseClient;
}> {
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

	const db = drizzle(client, {
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

	return {
		db, // Drizzle ORM Client
		client, // Raw SQL Client
	};
}

export { eq } from "drizzle-orm";
