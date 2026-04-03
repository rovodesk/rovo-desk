import { z } from "zod";
import { baseEventSchema } from "../../base";

export const stripeWebhookReceivedPayloadSchema = z.object({
	rawType: z.string(),
	providerEventId: z.string(),
	providerCreatedAt: z.coerce.date().optional(),
	deliveryAttempt: z.number().int().nonnegative().optional(),
	verified: z.boolean().optional(),

	objectType: z.string().optional(),
	objectId: z.string().nullable().optional(),
	accountId: z.string().nullable().optional(),

	livemode: z.boolean().optional(),
	pendingWebhooks: z.number().int().nonnegative().optional(),

	data: z.record(z.string(), z.unknown()),
});

export const stripeWebhookReceivedEventSchema = baseEventSchema.extend({
	type: z.literal("integration.stripe.webhook.received"),
	category: z.literal("integration"),
	subject: z.literal("provider:stripe"),
	payload: stripeWebhookReceivedPayloadSchema,
	payloadSchema: z.literal("integration.stripe.webhook.received.v1").optional(),
});

export type StripeWebhookReceivedEvent = z.infer<
	typeof stripeWebhookReceivedEventSchema
>;
