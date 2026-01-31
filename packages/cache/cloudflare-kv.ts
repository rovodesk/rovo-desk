import { noop } from "@zero-heads-lab/shared/utils";
import type { ICacheStore } from "./interface";

export class KvCacheStore implements ICacheStore {
	private readonly kv: KVNamespace;

	constructor(kv: KVNamespace) {
		this.kv = kv;
	}

	async get<T = unknown>(key: string): Promise<T | null> {
		return await this.kv.get<T>(key, "json");
	}

	async set(key: string, value: unknown, ttl?: number): Promise<void> {
		await this.kv.put(key, JSON.stringify(value), {
			expirationTtl: ttl,
		});
	}

	async delete(key: string): Promise<void> {
		await this.kv.delete(key);
	}

	close = noop;
}
