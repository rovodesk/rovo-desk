import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { keys } from "./keys";
import * as schema from "./schema";

// biome-ignore lint/suspicious/useAwait: No awaited value
export async function createDatabase() {
	if (typeof window !== "undefined") {
		throw new Error("Database can be used in server only");
	}

	if (!keys.DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined");
	}

	const client = postgres(keys.DATABASE_URL, {
		prepare: false,
		max: 1,
		idle_timeout: 20,
		connect_timeout: 10,
		fetch_types: false,
	});

	return drizzle(client, {
		schema,
		logger: {
			logQuery(query, params) {
				console.log("[DATABASE]", { query, params });
			},
		},
	});
}

export type Database = ReturnType<typeof createDatabase>;
