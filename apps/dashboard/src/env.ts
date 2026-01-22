import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	extends: [],
	clientPrefix: "VITE_",
	server: {
		CONVEX_URL: z.url().min(1).startsWith("https://").endsWith("convex.cloud"),
		CONVEX_SITE_URL: z
			.url()
			.min(1)
			.startsWith("https://")
			.endsWith("convex.site"),
	},
	client: {
		VITE_SITE_URL: z.url().min(1),
		VITE_CONVEX_URL: z
			.url()
			.min(1)
			.startsWith("https://")
			.endsWith("convex.cloud"),
	},
	runtimeEnvStrict: {
		VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
		VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
		CONVEX_URL: process.env.CONVEX_URL,
		CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
	},
});
