import { createEnv } from "@t3-oss/env-core";
<<<<<<< HEAD
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
=======
import { keys as authKeys } from "@zero-heads-lab/auth/keys";
import { keys as cacheKeys } from "@zero-heads-lab/cache/keys";
import { keys as databaseKeys } from "@zero-heads-lab/database/keys";
import { keys as emailKeys } from "@zero-heads-lab/email/keys";

export const env = createEnv({
	extends: [databaseKeys, authKeys, cacheKeys, emailKeys],
	server: {},
	runtimeEnvStrict: {},
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
});
