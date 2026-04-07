import { SQLDatabase } from "encore.dev/storage/sqldb";
import { createDatabaseConn, type Database, type DatabaseClient } from "./conn";

export const sharedDb = new SQLDatabase("shared-db", {
	migrations: {
		path: "./migrations",
		source: "drizzle",
	},
});

const databasePromise = createDatabaseConn(sharedDb.connectionString);

export async function db(): Promise<Database> {
	return (await databasePromise).db;
}

export async function sql(): Promise<DatabaseClient> {
	return (await databasePromise).client;
}
