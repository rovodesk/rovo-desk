import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	extends: [],
	clientPrefix: "VITE_",
	client: {
		VITE_ALLOWED_REDIRECT_TO_URLS: z.string(),
		VITE_ALLOWED_REDIRECT_FROM_URLS: z.string(),
		VITE_PARTYKIT_URL: z.url(),
		VITE_RPC_SERVER_URL: z.url(),

		VITE_KINDE_DOMAIN: z.string(),
		VITE_KINDE_CLIENT_ID: z.string(),
		VITE_KINDE_REDIRECT_URI: z.string(),
		VITE_KINDE_LOGOUT_URI: z.string(),
		VITE_KINDE_AUDIENCE: z.string().optional(),
	},
	runtimeEnv: {
		VITE_ALLOWED_REDIRECT_TO_URLS: import.meta.env
			.VITE_ALLOWED_REDIRECT_TO_URLS,
		VITE_ALLOWED_REDIRECT_FROM_URLS: import.meta.env
			.VITE_ALLOWED_REDIRECT_FROM_URLS,
		VITE_PARTYKIT_URL: import.meta.env.VITE_PARTYKIT_URL,
		VITE_RPC_SERVER_URL: import.meta.env.VITE_RPC_SERVER_URL,

		VITE_KINDE_AUDIENCE: import.meta.env.VITE_KINDE_AUDIENCE,
		VITE_KINDE_CLIENT_ID: import.meta.env.VITE_KINDE_CLIENT_ID,
		VITE_KINDE_DOMAIN: import.meta.env.VITE_KINDE_DOMAIN,
		VITE_KINDE_REDIRECT_URI: import.meta.env.VITE_KINDE_REDIRECT_URI,
		VITE_KINDE_LOGOUT_URI: import.meta.env.VITE_KINDE_LOGOUT_URI,
	},
});
