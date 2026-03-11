import { createEnv } from "@t3-oss/env-core";
import { keys as authKeys } from "@zero-heads-lab/auth/client";
import { z } from "zod";

export const env = createEnv({
	extends: [authKeys],
	clientPrefix: "VITE_",
	client: {
		VITE_ALLOWED_REDIRECT_FROM_URLS: z.string(),
	},
	runtimeEnv: {
		VITE_ALLOWED_REDIRECT_FROM_URLS: import.meta.env
			.VITE_ALLOWED_REDIRECT_FROM_URLS,
	},
});
