import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {},
	client: {
		VITE_CONVEX_URL: z.string().min(1),
	},
	clientPrefix: "VITE_",
	runtimeEnvStrict: {
		VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
	},
});
