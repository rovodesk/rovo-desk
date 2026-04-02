import { z } from "zod";
import { ACTOR_TYPES, EVENT_CATEGORIES, EVENT_PRIORITIES } from "./constants";

export const eventMetadataSchema = z
	.object({
		provider: z.string().nullable().optional(),
		providerEventId: z.string().nullable().optional(),

		correlationId: z.string().nullable().optional(),
		causationId: z.string().nullable().optional(),
		idempotencyKey: z.string().nullable().optional(),
		traceId: z.string().nullable().optional(),
		spanId: z.string().nullable().optional(),

		requestId: z.string().nullable().optional(),
		ip: z.string().nullable().optional(),
		userAgent: z.string().nullable().optional(),

		tags: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());

export const actorSchema = z.object({
	type: z.enum(ACTOR_TYPES),
	id: z.string().nullable().optional(),
});

export const baseEventSchema = z.object({
	id: z.string().min(1),
	type: z.string().min(1),
	category: z.enum(EVENT_CATEGORIES),
	source: z.string().min(1),
	subject: z.string().min(1),

	version: z.number().int().positive(),

	occurredAt: z.coerce.date(),
	receivedAt: z.coerce.date(),

	tenantId: z.string().nullable().optional(),

	actor: actorSchema.optional(),
	priority: z.enum(EVENT_PRIORITIES).optional(),

	metadata: eventMetadataSchema.optional(),

	payload: z.unknown(),
});

export type BaseEvent = z.infer<typeof baseEventSchema>;
