import { type BaseEvent, baseEventSchema } from "@zero-heads-lab/events";
import type { ILogger, ITracer } from "@zero-heads-lab/observability/lib/server";
import type { Context } from "hono";
import type { ApiGatewayServiceEnv, AuthQueueMessage } from "src/types";

export type IApiGatewayService = {
	sendToQueue: (event: BaseEvent) => Promise<void>;
};

export type ApiGatewayServiceDeps = {
	authServiceQueue: Queue<AuthQueueMessage>;
	tracer: ITracer;
	logger: ILogger;
};

export class ApiGatewayService implements IApiGatewayService {
	private readonly authServiceQueue: Queue<AuthQueueMessage>;
	private readonly tracer: ITracer;
	private readonly logger: ILogger;

	constructor(deps: ApiGatewayServiceDeps) {
		this.authServiceQueue = deps.authServiceQueue;
		this.tracer = deps.tracer;
		this.logger = deps.logger;
	}

	async sendToQueue(event: BaseEvent): Promise<void> {
		const validated = baseEventSchema.parse(event);

		const message: AuthQueueMessage = {
			version: 1,
			enqueuedAt: new Date().toISOString(),
			event: validated,
		};

		try {
			await this.tracer.withSpan("webhook.event.enqueue", async () => {
				await this.authServiceQueue.send(message, {
					contentType: "json",
				});
			});

			this.logger.info("Auth service event enqueued", {
				queue: "AuthServiceQueue",
				eventId: validated.eventId,
				eventType: validated.type,
				eventCategory: validated.category,
				eventSource: validated.source,
				eventSubject: validated.subject,
				eventVersion: validated.schemaVersion,
				eventOccurredAt: validated.occurredAt,
				eventReceivedAt: validated.receivedAt,
				eventTenantId: validated.tenantId,
				eventPriority: validated.priority,
				correlationId: validated.metadata?.correlationId ?? null,
				causationId: validated.metadata?.causationId ?? null,
				requestUserAgent: validated.metadata?.request?.userAgent ?? null,
			});
		} catch (error) {
			this.logger.error("Failed to enqueue webhook event", {
				queue: "WebhooksEventQueue",
				eventId: validated.eventId,
				eventType: validated.type,
				eventCategory: validated.category,
				eventSource: validated.source,
				error,
			});

			throw error;
		}
	}
}

export function createApiGatewayService(
	c: Context<ApiGatewayServiceEnv>
): IApiGatewayService {
	return new ApiGatewayService({
		authServiceQueue: c.env.AUTH_SERVICE_QUEUE,
		tracer: c.env.tracer,
		logger: c.env.logger,
	});
}
