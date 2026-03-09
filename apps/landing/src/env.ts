import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		API_URL: z.url(),
	},
	clientPrefix: "PUBLIC_",
	client: {
		PUBLIC_API_URL: z.url(),
	},
	runtimeEnv: {
		API_URL: process.env.API_URL,
		PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,
	},
});
