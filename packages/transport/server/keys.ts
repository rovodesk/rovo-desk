import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	server: {
		CONNECTION_SECRET_PREFIX: z.string().default("zh_"),
	},
	runtimeEnvStrict: {
		CONNECTION_SECRET_PREFIX: process.env.CONNECTION_SECRET_PREFIX,
	},
});
