import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const keys = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_RPC_SERVER_URL: z.url(),
	},
	runtimeEnvStrict: {
		VITE_RPC_SERVER_URL: import.meta.env.VITE_RPC_SERVER_URL,
	},
});
