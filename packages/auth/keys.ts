import { createEnv } from "@t3-oss/env-core";
import { keys as billingKeys } from "@zero-heads-lab/billing/keys";
import z from "zod";

export const keys = createEnv({
	extends: [billingKeys],
	server: {
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.url().default("http://localhost:3001").optional(),
		BETTER_AUTH_BASE_PATH: z.string().default("/api/auth").optional(),

		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),

		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
	},
	clientPrefix: "VITE_",
	client: {
		VITE_AUTH_BASE_URL: z.string(),
		VITE_AUTH_BASE_PATH: z.string(),
	},
	runtimeEnv: {
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		BETTER_AUTH_BASE_PATH: process.env.BETTER_AUTH_BASE_PATH,

		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

		VITE_AUTH_BASE_URL: import.meta.env.VITE_AUTH_BASE_URL,
		VITE_AUTH_BASE_PATH: import.meta.env.VITE_AUTH_BASE_PATH,
	},
});
