import { Injectable, Logger } from "@nestjs/common";
import type { DomainEvent, IEventBusPort } from "@/app/ports/event-bus.port";

/**
 * EventBusProvider
 *
 * Implements IEventBusPort.
 * Provides event publishing infrastructure.
 *
 * CURRENT: Simple in-memory implementation with logging.
 * FUTURE: Replace with SNS, Kafka, RabbitMQ, or EventBridge.
 *
 * Events published here can be consumed by:
 * - Other services (via message broker)
 * - Event handlers within this service
 * - Event log / audit trail
 */
@Injectable()
export class EventBusProvider implements IEventBusPort {
	private readonly logger = new Logger(EventBusProvider.name);

	/**
	 * Publish a single domain event.
	 */
	async publish<TPayload = Record<string, unknown>>(
		event: DomainEvent<TPayload>
	): Promise<void> {
		this.logger.debug(
			`Publishing event: ${event.name} for aggregate ${event.aggregateId}`,
			{
				event: event.name,
				aggregateId: event.aggregateId,
				occurredAt: event.occurredAt,
			}
		);

		// TODO: Route to SNS/Kafka/RabbitMQ
		// Example:
		// await this.sns.publishMessage({
		//   TopicArn: process.env.EVENT_TOPIC_ARN,
		//   Message: JSON.stringify(event),
		// });

		// For now, just log it
		// In a real app, persist this to an events table for eventual delivery
	}

	/**
	 * Publish multiple domain events atomically.
	 */
	async publishMany<TPayload = Record<string, unknown>>(
		events: DomainEvent<TPayload>[]
	): Promise<void> {
		this.logger.debug(`Publishing ${events.length} events`, {
			eventNames: events.map((e) => e.name),
		});

		// TODO: Implement batch publishing for efficiency
		// For now, publish sequentially
		for (const event of events) {
			await this.publish(event);
		}
	}
}
