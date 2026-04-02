import { config } from "dotenv";
import { createDrizzleConfig } from "./lib/config";

config({ path: ".env" });

export default createDrizzleConfig(
	process.env.DATABASE_URL!,
	"./lib/schemas/index.ts",
	"./lib/relations.ts",
	"./migrations"
);
