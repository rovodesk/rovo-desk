import { createEnv } from "@t3-oss/env-core";
import { keys as billingKeys } from "@zero-heads-lab/billing/keys";
import z from "zod";

export const keys = createEnv({
	extends: [billingKeys],
	server: {
		LOG_LEVEL: z
			.enum(["debug", "info", "warn", "error"])
			.optional()
			.default(process.env.NODE_ENV === "development" ? "debug" : "error"),
		POSTHOG_PROJECT_API_KEY: z.string(),
		POSTHOG_HOST: z.string(),
	},
	runtimeEnv: {
		LOG_LEVEL: process.env.LOG_LEVEL,
		POSTHOG_PROJECT_API_KEY: process.env.POSTHOG_PROJECT_API_KEY,
		POSTHOG_HOST: process.env.POSTHOG_HOST,
	},
});
