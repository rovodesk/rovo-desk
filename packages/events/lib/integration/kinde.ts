import { z } from "zod";
import { baseEventSchema } from "../base";

export const kindeWebhookReceivedPayloadSchema = z.object({
	rawType: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export const kindeWebhookReceivedEventSchema = baseEventSchema.extend({
	type: z.literal("integration.kinde.webhook.received"),
	category: z.literal("integration"),
	subject: z.literal("provider:kinde"),
	payload: kindeWebhookReceivedPayloadSchema,
});

export type KindeWebhookReceivedEvent = z.infer<
	typeof kindeWebhookReceivedEventSchema
>;
