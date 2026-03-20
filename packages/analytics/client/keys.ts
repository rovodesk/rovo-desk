import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const keys = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_POSTHOG_KEY: z.string(),
		VITE_POSTHOG_HOST: z.string(),
	},
	runtimeEnv: {
		VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
		VITE_POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,
	},
});
