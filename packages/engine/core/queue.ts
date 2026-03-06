import type { Command } from "../types";

export interface ICommandQueue<T = Command> {
	enqueue(key: string, element: T): void;
	dequeue(key: string): T | undefined;
	peek(key: string): T | undefined;
	isEmpty(key: string): boolean;
	size(key: string): number;
	flush(key?: string): void;
}

export class CommandQueue<T = Command> implements ICommandQueue<T> {
	private readonly queues = new Map<string, T[]>();

	enqueue(key: string, element: T): void {
		let q = this.queues.get(key);

		if (!q) {
			q = [];
			this.queues.set(key, q);
		}

		q.push(element);
	}

	dequeue(key: string): T | undefined {
		const q = this.queues.get(key);
		if (!q || q.length === 0) return undefined;

		const item = q.shift();
		// cleanup
		if (q.length === 0) this.queues.delete(key);

		return item;
	}

	peek(key: string): T | undefined {
		return this.queues.get(key)?.[0];
	}

	isEmpty(key: string): boolean {
		const q = this.queues.get(key);
		return !q || q.length === 0;
	}

	size(key: string): number {
		return this.queues.get(key)?.length ?? 0;
	}

	flush(key?: string): void {
		if (key) {
			this.queues.delete(key);
			return;
		}

		this.queues.clear();
	}
}
