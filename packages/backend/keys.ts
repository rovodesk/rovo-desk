import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	server: {
		BETTER_AUTH_URL: z.url().min(1),
	},
	runtimeEnvStrict: {
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
	},
});
