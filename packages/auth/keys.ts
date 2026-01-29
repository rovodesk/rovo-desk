import { createEnv } from "@t3-oss/env-core";
import { keys as databaseKeys } from "@zero-heads-lab/database/keys";
import z from "zod";

export const keys = createEnv({
	server: {
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.url().default("http://localhost:3001").optional(),
		BETTER_AUTH_BASE_PATH: z.string().default("/api/auth").optional(),

		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),

		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
	},
	client: {
		VITE_BETTER_AUTH_URL: z.url().default("http://localhost:3001").optional(),
		VITE_BETTER_AUTH_BASE_PATH: z.string().default("/api/auth").optional(),
	},
	clientPrefix: "VITE_",
	extends: [databaseKeys],
	runtimeEnv: {
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		BETTER_AUTH_BASE_PATH: process.env.BETTER_AUTH_BASE_PATH,
		VITE_BETTER_AUTH_URL: import.meta.env.VITE_BETTER_AUTH_URL,
		VITE_BETTER_AUTH_BASE_PATH: import.meta.env.VITE_BETTER_AUTH_BASE_PATH,

		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	},
});
