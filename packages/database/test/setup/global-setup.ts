import { afterAll, beforeAll } from "vitest";
import { cleanupTestDb, setupTestDb } from "./conn";

beforeAll(async () => {
	await setupTestDb();
});

afterAll(async () => {
	await cleanupTestDb();
});
