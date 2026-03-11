import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const keys = createEnv({
	clientPrefix: "VITE_PUBLIC_",
	client: {
		VITE_PUBLIC_POSTHOG_KEY: z.string(),
		VITE_PUBLIC_POSTHOG_HOST: z.string(),
	},
	runtimeEnv: {
		VITE_PUBLIC_POSTHOG_KEY: import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
		VITE_PUBLIC_POSTHOG_HOST: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
	},
});
