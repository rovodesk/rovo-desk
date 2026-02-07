import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { keys } from "./keys";
import * as schema from "./schema";

export function createDatabase() {
	if (typeof window !== "undefined") {
		throw new Error("Database can be used in server only");
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
