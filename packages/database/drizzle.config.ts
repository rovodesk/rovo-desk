import { config } from "dotenv";
import { createDrizzleConfig } from "./drizzle/config";

config({ path: "./.env.prod" });

export default createDrizzleConfig(
	process.env.DATABASE_URL!,
	"./drizzle/schemas/index.ts"
);
