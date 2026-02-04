import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	server: {
		DATABASE_URL: z.url().startsWith("postgresql://"),
	},
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
	},
});
