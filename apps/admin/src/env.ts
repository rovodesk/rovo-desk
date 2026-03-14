import { createEnv } from "@t3-oss/env-core";
import { keys as authKeys } from "@zero-heads-lab/auth/client";
import { z } from "zod";

export const env = createEnv({
	extends: [authKeys],
	clientPrefix: "VITE_",
	client: {
		VITE_ALLOWED_REDIRECT_FROM_URLS: z.string(),

		VITE_ADMIN_DASHBOARD_URL: z.string(),
		VITE_CLIENT_DASHBOARD_URL: z.string(),
	},
	runtimeEnv: {
		VITE_ALLOWED_REDIRECT_FROM_URLS: import.meta.env
			.VITE_ALLOWED_REDIRECT_FROM_URLS,
		VITE_ADMIN_DASHBOARD_URL: import.meta.env.VITE_ADMIN_DASHBOARD_URL,
		VITE_CLIENT_DASHBOARD_URL: import.meta.env.VITE_CLIENT_DASHBOARD_URL,
	},
});
