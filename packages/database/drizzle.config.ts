import { config } from "dotenv";
import { createDrizzleConfig } from "./drizzle/config";

config({ path: ".env" });

export default createDrizzleConfig();
