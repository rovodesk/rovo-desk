import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	clientPrefix: "VITE_",

	server: {
		DATABASE_URL: z.url().startsWith("postgresql://"),
	},

	client: {},
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
	},

	emptyStringAsUndefined: true,
});
