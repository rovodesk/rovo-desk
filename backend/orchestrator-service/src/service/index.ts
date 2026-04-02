import { type BaseEvent, baseEventSchema } from "@zero-heads-lab/events";
import type { ILogger, ITracer } from "@zero-heads-lab/observability";
import type { Context } from "hono";
import type { WebhookQueueMessage, WebhookServiceEnv } from "src/types";

export type IWebhookService = {
	ingest: (event: BaseEvent) => Promise<void>;
};

export type WebhookServiceDeps = {
	queue: Queue<WebhookQueueMessage>;
	tracer: ITracer;
	logger: ILogger;
};

export class WebhookService implements IWebhookService {
	private readonly queue: Queue<WebhookQueueMessage>;
	private readonly tracer: ITracer;
	private readonly logger: ILogger;

	constructor(deps: WebhookServiceDeps) {
		this.queue = deps.queue;
		this.tracer = deps.tracer;
		this.logger = deps.logger;
	}

	async ingest(event: BaseEvent): Promise<void> {
		const validated = baseEventSchema.parse(event);

		const message: WebhookQueueMessage = {
			version: 1,
			enqueuedAt: new Date().toISOString(),
			event: validated,
		};

		try {
			await this.tracer.withSpan("webhook.event.enqueue", async () => {
				await this.queue.send(message, {
					contentType: "json",
				});
			});

			this.logger.info("Webhook event enqueued", {
				queue: "WebhooksEventQueue",
				eventId: validated.id,
				eventType: validated.type,
				eventCategory: validated.category,
				eventSource: validated.source,
				eventSubject: validated.subject,
				eventVersion: validated.version,
				eventOccurredAt: validated.occurredAt,
				eventReceivedAt: validated.receivedAt,
				eventTenantId: validated.tenantId,
				eventPriority: validated.priority,
				correlationId: validated.metadata?.correlationId ?? null,
				causationId: validated.metadata?.causationId ?? null,
				traceId: validated.metadata?.traceId ?? null,
				requestId: validated.metadata?.requestId ?? null,
			});
		} catch (error) {
			this.logger.error("Failed to enqueue webhook event", {
				queue: "WebhooksEventQueue",
				eventId: validated.id,
				eventType: validated.type,
				eventCategory: validated.category,
				eventSource: validated.source,
				error,
			});

			throw error;
		}
	}
}

export function createWebhookService(
	c: Context<WebhookServiceEnv>
): IWebhookService {
	return new WebhookService({
		queue: c.env.WebhooksEventQueue,
		tracer: c.env.tracer,
		logger: c.env.logger,
	});
}
