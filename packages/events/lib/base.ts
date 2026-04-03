import { z } from "zod";
import { ACTOR_TYPES, EVENT_CATEGORIES, EVENT_PRIORITIES } from "./constants";

export const eventMetadataSchema = z
	.object({
		provider: z.string().optional(),
		providerEventId: z.string().optional(),

		correlationId: z.string().optional(),
		causationId: z.string().optional(),
		idempotencyKey: z.string().optional(),

		tracing: z
			.object({
				traceId: z.string().optional(),
				spanId: z.string().optional(),
			})
			.optional(),

		request: z
			.object({
				requestId: z.string().optional(),
				ip: z.string().optional(),
				userAgent: z.string().optional(),
			})
			.optional(),

		tags: z.array(z.string()).optional(),
	})
	.strict();

export const actorSchema = z.object({
	type: z.enum(ACTOR_TYPES),
	id: z.string().optional(),
});

export const deliverySchema = z.object({
	attempt: z.number().int().nonnegative().default(0),
	maxAttempts: z.number().int().positive().optional(),
	deadLettered: z.boolean().optional(),
});

export const baseEventSchema = z.object({
	eventId: z.string().min(1),

	type: z.string().min(1), // e.g. auth.user.created
	category: z.enum(EVENT_CATEGORIES),
	source: z.string().min(1), // e.g. auth-service
	subject: z.string().min(1), // e.g. user:usr_123

	schemaVersion: z.number().int().positive(),
	eventVersion: z.number().int().positive().optional(),

	occurredAt: z.coerce.date(),
	receivedAt: z.coerce.date(),

	tenantId: z.string().optional(),
	partitionKey: z.string().optional(),

	actor: actorSchema.optional(),
	priority: z.enum(EVENT_PRIORITIES).optional(),
	delivery: deliverySchema.optional(),
	metadata: eventMetadataSchema.optional(),

	payload: z.unknown(),
	payloadSchema: z.string().optional(),
});

export type BaseEvent = z.infer<typeof baseEventSchema>;
