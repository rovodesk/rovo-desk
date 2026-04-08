// application/ports/event-bus.port.ts

export interface DomainEvent<TPayload = Record<string, unknown>> {
	name: string;
	aggregateId: string;
	occurredAt: Date;
	payload: TPayload;
	metadata?: Record<string, unknown>;
}

export abstract class IEventBusPort {
	abstract publish<TPayload = Record<string, unknown>>(
		event: DomainEvent<TPayload>
	): Promise<void>;

	abstract publishMany<TPayload = Record<string, unknown>>(
		events: DomainEvent<TPayload>[]
	): Promise<void>;
}
