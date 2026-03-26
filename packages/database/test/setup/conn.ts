import { execSync } from "node:child_process";
import postgres from "postgres";
import {
	GenericContainer,
	type StartedTestContainer,
	Wait,
} from "testcontainers";
import { createDatabase } from "../../conn";

let container: StartedTestContainer;
let database: Awaited<ReturnType<typeof createDatabase>>;
let url: string;

export async function setupTestDb() {
	container = await new GenericContainer("postgres:16")
		.withEnvironment({
			POSTGRES_USER: "test",
			POSTGRES_PASSWORD: "test",
			POSTGRES_DB: "testdb",
		})
		.withExposedPorts(5432)
		.withWaitStrategy(Wait.forListeningPorts()) // Better for Mac
		.start();

	const host = container.getHost();
	const port = container.getMappedPort(5432);
	url = `postgresql://test:test@${host}:${port}/testdb`;

	// --- 1. PROBE & PREPARE ---
	const sql = postgres(url, {
		max: 1,
		onnotice: (notice) => {
			console.log("Notice:", notice);
		},
	});

	// Retry loop to ensure DB is truly ready
	let ready = false;
	for (let i = 0; i < 10; i++) {
		try {
			await sql`SELECT 1`;
			ready = true;
			break;
		} catch (e) {
			console.error("Database not ready yet:", e);
			await new Promise((res) => setTimeout(res, 500));
		}
	}

	if (!ready) throw new Error("Database failed to become ready");

	// --- 2. RUN MIGRATIONS ---
	try {
		const output = execSync(
			"bunx drizzle-kit migrate --config ./drizzle.test.config.ts",
			{
				env: {
					...process.env,
					TEST_DATABASE_URL: url,
					DATABASE_URL: url,
					NODE_ENV: "test",
				},
				encoding: "utf8",
			}
		);

		console.log(output);
		// biome-ignore lint/suspicious/noExplicitAny: Any error from execSync is fine
	} catch (err: any) {
		console.error("❌ Migration failed!");
		console.error("STDOUT:", err?.stdout?.toString?.() ?? err?.stdout);
		console.error("STDERR:", err?.stderr?.toString?.() ?? err?.stderr);

		throw err;
	}

	database = await createDatabase(url);
	return { ...database, container, url };
}

export async function cleanupTestDb() {
	await database?.client.end({ timeout: 5 });
	await container?.stop();
}

// biome-ignore lint/suspicious/useAwait: No Awaited function
export async function getTestDb() {
	if (!database) {
		throw new Error("Test DB not initialized");
	}
	return database;
}

export function getTestDatabaseUrl() {
	if (!url) {
		throw new Error("Test DB URL not initialized");
	}
	return url;
}
