import { defineConfig } from "drizzle-kit";
import { keys } from "../keys";

export function createDrizzleConfig(
	overrides?: Partial<Parameters<typeof defineConfig>[0]>
) {
	return defineConfig({
		schema: "./schema.ts",
		out: "./drizzle/migrations",
		dialect: "postgresql",
		dbCredentials: {
			url: keys.DATABASE_URL,
		},
		migrations: {
			table: "__migrations__",
		},
		casing: "camelCase",
		entities: {
			roles: {
				provider: "postgres",
			},
		},
		...overrides, // Must be at the end
	});
}
