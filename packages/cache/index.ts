import type { ICacheStore } from "./interface";

export class KvCacheStore implements ICacheStore {
	private readonly kv: KVNamespace;
	private readonly prefix?: string;

	constructor(kv: KVNamespace, prefix?: string) {
		this.kv = kv;
		this.prefix = prefix;
	}

	// Key function to set key and prefix
	private key(key: string) {
		return this.prefix ? `${this.prefix}:${key}` : key;
	}

	async get<T = unknown>(key: string): Promise<T | null> {
		return await this.kv.get<T>(this.key(key), "json");
	}

	async set(key: string, value: unknown, ttl?: number): Promise<void> {
		await this.kv.put(this.key(key), JSON.stringify(value), {
			expirationTtl: ttl,
		});
	}

	async delete(key: string): Promise<void> {
		await this.kv.delete(this.key(key));
	}

	/**
	 * Creates a scoped cache store with additional prefix
	 */
	withPrefix(prefix: string): KvCacheStore {
		const newPrefix = this.prefix ? `${this.prefix}:${prefix}` : prefix;

		return new KvCacheStore(this.kv, newPrefix);
	}
}
