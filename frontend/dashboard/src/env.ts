import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	extends: [],
	clientPrefix: "VITE_",
	client: {
		VITE_API_BASE_URL: z.url(),
		VITE_PARTYKIT_URL: z.url(),
	},
	runtimeEnv: {
		VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
		VITE_PARTYKIT_URL: import.meta.env.VITE_PARTYKIT_URL,
	},
});
