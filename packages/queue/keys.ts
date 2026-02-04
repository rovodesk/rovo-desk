import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = createEnv({
	server: {
		RABBITMQ_URL: z.url().startsWith("amqp://"),
	},
	runtimeEnvStrict: {
		RABBITMQ_URL: process.env.RABBITMQ_URL,
	},
});
