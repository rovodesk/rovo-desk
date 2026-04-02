import { createDrizzleConfig } from "./lib/config";

const url = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

if (!url) {
	throw new Error(
		"TEST_DATABASE_URL or DATABASE_URL must be set for test migrations"
	);
}

export default createDrizzleConfig(
	url,
	"./lib/schemas/index.ts",
	"./lib/relations.ts",
	"./migrations"
);
