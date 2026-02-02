import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const resendFromSchema = z.string().regex(/^.+\s<[^<>@]+@[^<>@]+\.[^<>@]+>$/, {
	message: "RESEND_FROM must be in the format: Name <email@example.com>",
});

export const keys = createEnv({
	server: {
		RESEND_FROM: resendFromSchema
			.optional()
			.default("Acme <onboarding@resend.dev>"),
		RESEND_TOKEN: z.string().startsWith("re_"),
	},
	runtimeEnvStrict: {
		RESEND_FROM: process.env.RESEND_FROM,
		RESEND_TOKEN: process.env.RESEND_TOKEN,
	},
});
