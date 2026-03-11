import { createEnv } from "@t3-oss/env-core";
import { keys as billingKeys } from "@zero-heads-lab/billing/keys";
import z from "zod";

export const keys = createEnv({
	extends: [billingKeys],
	server: {
		POSTHOG_TOKEN: z.string(),
		POSTHOG_HOST: z.string(),
	},
	runtimeEnv: {
		POSTHOG_TOKEN: process.env.POSTHOG_TOKEN,
		POSTHOG_HOST: process.env.POSTHOG_HOST,
	},
});
