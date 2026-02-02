import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	server: {
		REDIS_URL: z.url().startsWith("redis://"),
	},
	runtimeEnvStrict: {
		REDIS_URL: process.env.REDIS_URL,
	},
});
