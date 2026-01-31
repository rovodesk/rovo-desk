import Redis from "ioredis";
import type { ICacheStore } from "./interface";

export class RedisCacheStore implements ICacheStore {
	private readonly redis: Redis;

	constructor(redisUrl: string) {
		this.redis = new Redis(redisUrl);
	}

	async get<T = unknown>(key: string): Promise<T | null> {
		console.log("[CACHE] GET", key);
		const value = await this.redis.get(key);
		return value ? (JSON.parse(value) as T) : null;
	}

	async set(key: string, value: unknown, ttl?: number): Promise<void> {
		console.log("[CACHE] SET", key);
		const payload = JSON.stringify(value);

		if (ttl) {
			await this.redis.set(key, payload, "EX", ttl);
		} else {
			await this.redis.set(key, payload);
		}
	}

	async delete(key: string): Promise<void> {
		console.log("[CACHE] DEL", key);
		await this.redis.del(key);
	}

	async close(): Promise<void> {
		console.log("[CACHE] QUIT");
		await this.redis.quit();
	}
}
