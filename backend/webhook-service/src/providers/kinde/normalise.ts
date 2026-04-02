import type { KindeWebhookReceivedEvent } from "@zero-heads-lab/events/integration/kinde";

export function normalizeKindeWebhook(input: {
	rawBody: Record<string, unknown>;
	providerEventId: string;
	idempotencyKey: string;
	requestId?: string | null;
	traceId?: string | null;
}): KindeWebhookReceivedEvent {
	const rawType =
		typeof input.rawBody.type === "string" ? input.rawBody.type : "unknown";

	const now = new Date();

	return {
		id: crypto.randomUUID(),

		type: "integration.kinde.webhook.received",
		category: "integration",
		source: "webhook-service",
		subject: "provider:kinde",

		version: 1,
		occurredAt: now,
		receivedAt: now,

		actor: {
			type: "service",
			id: "kinde",
		},

		metadata: {
			provider: "kinde",
			providerEventId: input.providerEventId,

			// 🔑 CRITICAL FOR QUEUE-FIRST SYSTEM
			correlationId: input.providerEventId,
			causationId: input.providerEventId,
			idempotencyKey: input.idempotencyKey,

			traceId: input.traceId ?? input.providerEventId,
			requestId: input.requestId ?? null,
		},

		payload: {
			rawType,
			data: input.rawBody,
		},
	};
}
