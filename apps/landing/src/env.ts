import { createEnv } from "@t3-oss/env-core";
import { keys as analyticsClientKeys } from "@zero-heads-lab/analytics/client/keys";
import { z } from "zod";

export const env = createEnv({
	extends: [analyticsClientKeys],
	server: {
		BASE_API_URL: z.url(),
	},
	clientPrefix: "VITE_",
	client: {
		VITE_BASE_API_URL: z.url(),
	},
	runtimeEnv: {
		BASE_API_URL: process.env.BASE_API_URL,
		VITE_BASE_API_URL: import.meta.env.VITE_BASE_API_URL,
	},
});
