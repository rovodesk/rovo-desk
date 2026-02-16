import { createEnv } from "@t3-oss/env-core";
import { keys as authKeys } from "@zero-heads-lab/auth/client";
import { keys as transportKeys } from "@zero-heads-lab/transport/client";
import { z } from "zod";

export const env = createEnv({
	extends: [transportKeys, authKeys],
	clientPrefix: "VITE_",
	client: {
		VITE_ALLOWED_REDIRECT_TO_URLS: z.string(),
		VITE_ALLOWED_REDIRECT_FROM_URLS: z.string(),
		VITE_PARTYKIT_URL: z.url(),
	},
	runtimeEnv: {
		VITE_ALLOWED_REDIRECT_TO_URLS: import.meta.env
			.VITE_ALLOWED_REDIRECT_TO_URLS,
		VITE_ALLOWED_REDIRECT_FROM_URLS: import.meta.env
			.VITE_ALLOWED_REDIRECT_FROM_URLS,
		VITE_PARTYKIT_URL: import.meta.env.VITE_PARTYKIT_URL,
	},
});
