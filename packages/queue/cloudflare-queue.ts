import type { IQueue, QueueBindings } from "./interface";

export class CloudflareQueue implements IQueue {
	private readonly queues: QueueBindings;

	constructor(queues: QueueBindings) {
		this.queues = queues;
	}

	async publish(queue: string, message: string): Promise<void> {
		const q = this.queues[queue];

		if (!q) {
			throw new Error(`Queue "${queue}" not found in bindings`);
		}

		await q.send(message);
	}

	/**
	 * This method is only meaningful inside a Worker `queue()` handler.
	 * It exists to keep the interface consistent with RabbitMQ.
	 */
	consume(_queue: string, _callback: (message: string) => Promise<void>): void {
		throw new Error(
			"consume() is handled by the Worker queue() handler in Cloudflare Queues"
		);
	}
}
