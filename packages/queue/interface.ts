export interface IQueue {
	publish(queue: string, message: string, jobName?: string): Promise<void>;
	consume(
		queue: string,
		callback: (message: string) => Promise<void>
	): Promise<void> | void;
}

export type QueueBindings = Record<string, Queue>;
