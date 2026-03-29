import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { IQueueService, QueueJob } from "./interface";

export class QueueService implements IQueueService {
	private readonly queue: Queue;
	private readonly tracer: ITracer;

	constructor(queue: Queue, tracer: ITracer) {
		this.queue = queue;
		this.tracer = tracer;
	}

	private now() {
		return new Date().toISOString();
	}

	private wrapData<T>(data: T, timestamp: string): QueueJob<T> {
		return {
			job: "data",
			data,
			metadata: {
				timestamp,
			},
		};
	}

	private wrapJob<T>(payload: QueueJob<T>, timestamp: string): QueueJob<T> {
		return {
			...payload,
			metadata: {
				timestamp,
				...payload.metadata,
			},
		};
	}

	// ------------------------
	// DATA MODE
	// ------------------------

	async enqueue<T>(data: T, options?: QueueSendOptions): Promise<void> {
		await this.tracer.withSpan("queue.enqueue", async (span) => {
			const timestamp = this.now();

			span.setAttributes({
				"messaging.system": "cloudflare_queues",
				"messaging.operation": "publish",
			});

			try {
				await this.queue.send(this.wrapData(data, timestamp), options);
			} catch (error) {
				span.recordException?.(error as Error);
				throw error;
			}
		});
	}

	async enqueueBatch<T>(
		data: T[],
		options?: QueueSendBatchOptions
	): Promise<void> {
		if (data.length === 0) return;

		await this.tracer.withSpan("queue.enqueueBatch", async (span) => {
			const timestamp = this.now();

			span.setAttributes({
				"messaging.system": "cloudflare_queues",
				"messaging.operation": "publish",
				"queue.batch.size": data.length,
			});

			try {
				await this.queue.sendBatch(
					data.map((item) => ({
						body: this.wrapData(item, timestamp),
					})),
					options
				);
			} catch (error) {
				span.recordException?.(error as Error);
				throw error;
			}
		});
	}

	// ------------------------
	// JOB MODE
	// ------------------------

	async enqueueJob<T>(
		payload: QueueJob<T>,
		options?: QueueSendOptions
	): Promise<void> {
		await this.tracer.withSpan("queue.enqueueJob", async (span) => {
			const timestamp = this.now();

			span.setAttributes({
				"messaging.system": "cloudflare_queues",
				"messaging.operation": "publish",
				"queue.job": payload.job ?? "anonymous",
			});

			try {
				await this.queue.send(this.wrapJob(payload, timestamp), options);
			} catch (error) {
				span.recordException?.(error as Error);
				throw error;
			}
		});
	}

	async enqueueJobBatch<T>(
		payloads: QueueJob<T>[],
		options?: QueueSendBatchOptions
	): Promise<void> {
		if (payloads.length === 0) return;

		await this.tracer.withSpan("queue.enqueueJobBatch", async (span) => {
			const timestamp = this.now();

			span.setAttributes({
				"messaging.system": "cloudflare_queues",
				"messaging.operation": "publish",
				"queue.batch.size": payloads.length,
				"queue.hasNamedJobs": payloads.some((p) => !!p.job),
			});

			try {
				await this.queue.sendBatch(
					payloads.map((payload) => ({
						body: this.wrapJob(payload, timestamp),
					})),
					options
				);
			} catch (error) {
				span.recordException?.(error as Error);
				throw error;
			}
		});
	}
}
