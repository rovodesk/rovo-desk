import { createEnv } from "@t3-oss/env-core";
import { keys as authKeys } from "@zero-heads-lab/auth/keys";
import { keys as databaseKeys } from "@zero-heads-lab/database/keys";
import { z } from "zod";

export const env = createEnv({
	extends: [databaseKeys, authKeys],
	clientPrefix: "VITE_",
	server: {
		CLERK_SECRET_KEY: z.string().min(1),
	},
	client: {
		VITE_CONVEX_URL: z
			.url()
			.min(1)
			.startsWith("https://")
			.endsWith("convex.cloud"),
		VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
	},
	runtimeEnvStrict: {
		VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
		VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
	},
});
