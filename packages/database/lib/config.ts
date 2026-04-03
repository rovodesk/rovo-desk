import { defineConfig } from "drizzle-kit";

export function createDrizzleConfig(
	url: string,
	schemaFile: string,
	relationsFile: string,
	migrationFolder?: string,
	overrides?: Partial<Parameters<typeof defineConfig>[0]>
) {
	if (!url) {
		throw new Error("Database URL is required for Drizzle config");
	}

	return defineConfig({
		schema: [schemaFile, relationsFile],
		out: migrationFolder ?? "./migrations",
		dialect: "postgresql",
		dbCredentials: {
			url,
		},
		migrations: {
			table: "__migrations__",
		},
		casing: "snake_case",
		entities: {
			roles: {
				provider: "postgres",
			},
		},
		...overrides,
	});
}
