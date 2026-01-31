import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	clientPrefix: "VITE_",

	server: {
		REDIS_URL: z.url().startsWith("redis://"),
	},

	client: {},
	runtimeEnvStrict: {
		REDIS_URL: process.env.REDIS_URL,
	},

	emptyStringAsUndefined: true,
});
