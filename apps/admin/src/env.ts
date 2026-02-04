import { createEnv } from "@t3-oss/env-core";
import { keys as transportKeys } from "@zero-heads-lab/transport/keys/client";
import z from "zod";

export const env = createEnv({
	extends: [transportKeys],
	server: {},
	clientPrefix: "VITE_",
	client: {
		VITE_BETTER_AUTH_URL: z.url(),
		VITE_BETTER_AUTH_BASE_PATH: z.string(),
	},
	runtimeEnv: {
		VITE_BETTER_AUTH_URL: import.meta.env.VITE_BETTER_AUTH_URL,
		VITE_BETTER_AUTH_BASE_PATH: import.meta.env.VITE_BETTER_AUTH_BASE_PATH,
	},
});
