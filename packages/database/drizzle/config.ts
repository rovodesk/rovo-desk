import { defineConfig } from "drizzle-kit";

export function createDrizzleConfig(
	url: string,
	schemaFile: string,
	migrationFolder?: string,
	overrides?: Partial<Parameters<typeof defineConfig>[0]>
) {
	if (!url) {
		throw new Error("Database URL is required for Drizzle config");
	}

	return defineConfig({
		schema: schemaFile,
		out: migrationFolder ?? "./drizzle/migrations",
		dialect: "postgresql",
		dbCredentials: {
			url,
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
		...overrides,
	});
}
