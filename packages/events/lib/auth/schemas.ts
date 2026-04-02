import { z } from "zod";
import { baseEventSchema } from "../base";

export const authUserCreatedPayloadSchema = z.object({
	userId: z.string(),
	email: z.email(),
	name: z.string().nullable().optional(),
});

export const authUserCreatedEventSchema = baseEventSchema.extend({
	type: z.literal("auth.user.created"),
	category: z.literal("auth"),
	subject: z.string().regex(/^user:/),
	payload: authUserCreatedPayloadSchema,
});
