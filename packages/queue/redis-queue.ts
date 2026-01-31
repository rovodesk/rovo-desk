import { noop } from "@zero-heads-lab/shared/utils";
import { type Job, Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import type { IQueue } from "./interface";

export class RedisQueue implements IQueue {
	private readonly queueInstances: Map<string, Queue> = new Map();
	private readonly workerInstances: Map<string, Worker> = new Map();
	private readonly connection: IORedis;

	constructor(url: string) {
		// BullMQ uses ioredis for the connection
		this.connection = new IORedis(url, {
			maxRetriesPerRequest: null, // BullMQ requirement
		});

		// Connect to Redis
		this.connect();
	}

	private async connect(): Promise<void> {
		// ioredis connects automatically, but we can verify it
		if (this.connection.status !== "ready") {
			await this.connection.connect().catch(noop);
		}
		console.log("Successfully connected to Redis via BullMQ");
	}

	async publish(
		queueName: string,
		message: string,
		jobName?: string
	): Promise<void> {
		let queue = this.queueInstances.get(queueName);

		if (!queue) {
			queue = new Queue(queueName, { connection: this.connection });
			this.queueInstances.set(queueName, queue);
		}

		// BullMQ messages are objects; we've named the job 'default'
		await queue.add(
			jobName ?? "default-job",
			{ data: message },
			{
				attempts: 3, // Built-in retry logic!
				backoff: { type: "exponential", delay: 1000 },
			}
		);
	}

	consume(
		queueName: string,
		callback: (message: string) => Promise<void>
	): void {
		if (this.workerInstances.has(queueName)) return;

		const worker = new Worker(
			queueName,
			async (job: Job) => {
				// job.data contains our message object
				await callback(job.data.data);
			},
			{
				connection: this.connection,
				concurrency: 1, // Equivalent to RabbitMQ prefetch(1)
			}
		);

		worker.on("failed", (job, err) => {
			console.error(`Job ${job?.id} failed: ${err.message}`);
		});

		this.workerInstances.set(queueName, worker);
	}

	async disconnect(): Promise<void> {
		// Close all workers and queues
		for (const worker of this.workerInstances.values()) {
			await worker.close();
		}
		for (const queue of this.queueInstances.values()) {
			await queue.close();
		}

		await this.connection.quit();
		this.workerInstances.clear();
		this.queueInstances.clear();
	}
}
