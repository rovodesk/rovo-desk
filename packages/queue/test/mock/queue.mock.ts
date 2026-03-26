/** biome-ignore-all lint/suspicious/useAwait: No Awaited Function */
import { vi } from "vitest";
import type { IQueueService, QueueJob } from "../../interface";

export class MockQueueService implements IQueueService {
	jobs: QueueJob[] = [];
	batches: QueueJob[][] = [];

	enqueue = vi.fn(async <T>(data: T) => {
		this.jobs.push({
			job: "data",
			data,
		});
	});

	enqueueBatch = vi.fn(async <T>(data: T[]) => {
		const batch = data.map((item) => ({
			job: "data",
			data: item,
		}));
		this.jobs.push(...batch);
		this.batches.push(batch);
	});

	enqueueJob = vi.fn(async <T>(payload: QueueJob<T>) => {
		this.jobs.push(payload);
	});

	enqueueJobBatch = vi.fn(async <T>(payloads: QueueJob<T>[]) => {
		this.jobs.push(...payloads);
		this.batches.push(payloads);
	});

	clear() {
		this.jobs = [];
		this.batches = [];
		vi.clearAllMocks();
	}
}
