export interface QueueJob<T = unknown> {
	data: T;
	job: string;
	metadata?: {
		id?: string;
		traceId?: string;
		userId?: string;
		orgId?: string;
		timestamp?: string;
	};
}

export interface IQueueService {
	enqueue<T>(data: T, options?: QueueSendOptions): Promise<void>;
	enqueueBatch<T>(data: T[], options?: QueueSendBatchOptions): Promise<void>;

	enqueueJob<T>(
		payload: QueueJob<T>,
		options?: QueueSendOptions
	): Promise<void>;

	enqueueJobBatch<T>(
		payloads: QueueJob<T>[],
		options?: QueueSendBatchOptions
	): Promise<void>;
}
