import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const keys = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_SIGN_OUT_REDIRECT_URL: z.string(),
<<<<<<< HEAD
		VITE_SIGN_IN_CALLBACK_URL: z.string().optional(),
=======
		VITE_SIGN_IN_CALLBACK_URL: z.string(),
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
		VITE_ADMIN_SIGN_IN_CALLBACK_URL: z.string().optional(),
		VITE_AUTH_SERVER_URL: z.string(),
		VITE_AUTH_SERVER_BASE_PATH: z.string(),
	},
	runtimeEnv: {
		VITE_SIGN_OUT_REDIRECT_URL: import.meta.env.VITE_SIGN_OUT_REDIRECT_URL,
		VITE_SIGN_IN_CALLBACK_URL: import.meta.env.VITE_SIGN_IN_CALLBACK_URL,
<<<<<<< HEAD
		VITE_ADMIN_SIGN_IN_CALLBACK_URL: import.meta.env
			.VITE_ADMIN_SIGN_IN_CALLBACK_URL,
=======
		VITE_ADMIN_SIGN_IN_CALLBACK_URL: import.meta.env.VITE_ADMIN_SIGN_IN_CALLBACK_URL,
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
		VITE_AUTH_SERVER_URL: import.meta.env.VITE_AUTH_SERVER_URL,
		VITE_AUTH_SERVER_BASE_PATH: import.meta.env.VITE_AUTH_SERVER_BASE_PATH,
	},
});
