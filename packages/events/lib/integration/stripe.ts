import { z } from "zod";
import { baseEventSchema } from "../base";

export const stripeWebhookReceivedPayloadSchema = z.object({
	rawType: z.string(),
	objectId: z.string().nullable().optional(),
	accountId: z.string().nullable().optional(),
	data: z.record(z.string(), z.unknown()),
});

export const stripeWebhookReceivedEventSchema = baseEventSchema.extend({
	type: z.literal("integration.stripe.webhook.received"),
	category: z.literal("integration"),
	subject: z.literal("provider:stripe"),
	payload: stripeWebhookReceivedPayloadSchema,
});

export type StripeWebhookReceivedEvent = z.infer<
	typeof stripeWebhookReceivedEventSchema
>;
