import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_ALLOWED_REDIRECT_FROM_URLS: z.string(),

		// Auth
		VITE_KINDE_DOMAIN: z.string(),
		VITE_KINDE_CLIENT_ID: z.string(),
		VITE_KINDE_REDIRECT_URI: z.string(),
		VITE_KINDE_LOGOUT_URI: z.string(),
		VITE_KINDE_AUDIENCE: z.string().optional(),

		VITE_ADMIN_DASHBOARD_URL: z.string(),
		VITE_CLIENT_DASHBOARD_URL: z.string(),
	},
	runtimeEnv: {
		VITE_KRATOS_URL: import.meta.env.VITE_KRATOS_URL,
		VITE_ALLOWED_REDIRECT_FROM_URLS: import.meta.env
			.VITE_ALLOWED_REDIRECT_FROM_URLS,
		VITE_ADMIN_DASHBOARD_URL: import.meta.env.VITE_ADMIN_DASHBOARD_URL,
		VITE_CLIENT_DASHBOARD_URL: import.meta.env.VITE_CLIENT_DASHBOARD_URL,
		VITE_KINDE_AUDIENCE: import.meta.env.VITE_KINDE_AUDIENCE,
		VITE_KINDE_CLIENT_ID: import.meta.env.VITE_KINDE_CLIENT_ID,
		VITE_KINDE_DOMAIN: import.meta.env.VITE_KINDE_DOMAIN,
		VITE_KINDE_REDIRECT_URI: import.meta.env.VITE_KINDE_REDIRECT_URI,
		VITE_KINDE_LOGOUT_URI: import.meta.env.VITE_KINDE_LOGOUT_URI,
	},
});
