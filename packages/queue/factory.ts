import { CloudflareQueue } from "cloudflare-queue";
import type { IQueue, QueueBindings } from "./interface";
import { keys } from "./keys";
import { RedisQueue } from "./redis-queue";

type QueueEnv = {
	NODE_ENV?: "production" | "development";
	QUEUE?: QueueBindings;
};

export function createQueue(env: QueueEnv = {}): IQueue {
	const isProduction =
		env.NODE_ENV === "production" ||
		(typeof process !== "undefined" && process.env.NODE_ENV === "production");

	if (!isProduction) {
		return new RedisQueue(keys.RABBITMQ_URL);
	}

	if (!env.QUEUE) {
		throw new Error("QUEUE is required in production");
	}

	return new CloudflareQueue(env.QUEUE);
}
