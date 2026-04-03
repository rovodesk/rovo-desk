import { z } from "zod";
import { baseEventSchema } from "../../base";

export const kindeWebhookReceivedPayloadSchema = z.object({
	rawType: z.string(),
	providerEventId: z.string(),
	providerCreatedAt: z.coerce.date().optional(),
	deliveryAttempt: z.number().int().nonnegative().optional(),
	verified: z.boolean(),

	objectType: z.string().optional(),
	objectId: z.string().optional(),

	data: z.record(z.string(), z.unknown()),
});

export const kindeWebhookReceivedEventSchema = baseEventSchema.extend({
	type: z.literal("integration.kinde.webhook.received"),
	category: z.literal("integration"),
	subject: z.literal("provider:kinde"),
	payload: kindeWebhookReceivedPayloadSchema,
	payloadSchema: z.literal("integration.kinde.webhook.received.v1").optional(),
});

export type KindeWebhookReceivedEvent = z.infer<
	typeof kindeWebhookReceivedEventSchema
>;
