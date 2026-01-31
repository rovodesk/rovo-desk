import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	clientPrefix: "VITE_",

	server: {
		RABBITMQ_URL: z.url().startsWith("amqp://"),
	},

	client: {},
	runtimeEnvStrict: {
		RABBITMQ_URL: process.env.RABBITMQ_URL,
	},

	emptyStringAsUndefined: true,
});
