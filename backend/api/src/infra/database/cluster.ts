import { SQLDatabase } from "encore.dev/storage/sqldb";

/**
 * Shared SQL cluster for the entire backend.
 * All services reference this by name.
 */
export const sharedSQL = new SQLDatabase("shared-db");
