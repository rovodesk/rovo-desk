import { createEnv } from "@t3-oss/env-core";
import z from "zod";

const booleanish = z.union([z.boolean(), z.string()]).transform((value) => {
	if (typeof value === "boolean") return value;
	return value === "true";
});

export const logLevelSchema = z.enum(["debug", "info", "warn", "error"]);

export const analyticsEnvSchema = {
	LOG_LEVEL: logLevelSchema.optional(),
	ANALYTICS_ENABLED: booleanish.optional(),
	POSTHOG_API_KEY: z.string().optional(),
	POSTHOG_HOST: z.string().url().optional(),
	DEBUG: booleanish.optional(),
};

export function createAnalyticsEnv(
	runtimeEnv: Record<string, string | boolean | undefined>
) {
	return createEnv({
		server: analyticsEnvSchema,
		runtimeEnv,
	});
}

export type AnalyticsEnv = ReturnType<typeof createAnalyticsEnv>;
