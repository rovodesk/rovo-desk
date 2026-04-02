import type { ITracer } from "@zero-heads-lab/observability";

export interface ICacheStore {
	get<T = unknown>(key: string): Promise<T | null>;
	set(key: string, value: unknown, ttl?: number): Promise<void>;
	list(listOptions?: {
		limit?: number;
		cursor?: string;
	}): Promise<KVNamespaceListResult<unknown, string>>;
	delete(key: string): Promise<void>;
	withPrefix(prefix: string): ICacheStore;
}

export class CacheStore implements ICacheStore {
	private readonly kv: KVNamespace;
	private readonly prefix?: string;
	private readonly trace: ITracer;

	constructor(kv: KVNamespace, trace: ITracer, prefix?: string) {
		this.kv = kv;
		this.prefix = prefix;
		this.trace = trace;
	}

	// Key function to set key and prefix
	private key(key: string) {
		return this.prefix ? `${this.prefix}:${key}` : key;
	}

	async get<T = unknown>(key: string): Promise<T | null> {
		return await this.trace.withSpan("cache.get", async (span) => {
			span.setAttribute("cache.key", this.key(key));
			return await this.kv.get<T>(this.key(key), "json");
		});
	}

	async set(key: string, value: unknown, ttl?: number): Promise<void> {
		await this.trace.withSpan("cache.set", async (span) => {
			span.setAttribute("cache.key", this.key(key));
			await this.kv.put(this.key(key), JSON.stringify(value), {
				expirationTtl: ttl,
			});
		});
	}

	async delete(key: string): Promise<void> {
		await this.trace.withSpan("cache.delete", async (span) => {
			span.setAttribute("cache.key", this.key(key));
			await this.kv.delete(this.key(key));
		});
	}

	async list(listOptions?: {
		limit?: number;
		cursor?: string;
	}): Promise<KVNamespaceListResult<unknown, string>> {
		return await this.trace.withSpan("cache.list", async (span) => {
			const prefix = this.prefix ? `${this.prefix}:` : undefined;
			span.setAttribute("cache.prefix", prefix || "");
			return await this.kv.list({
				limit: listOptions?.limit,
				prefix,
				cursor: listOptions?.cursor,
			});
		});
	}

	/**
	 * Creates a scoped cache store with additional prefix
	 */
	withPrefix(prefix: string): ICacheStore {
		const newPrefix = this.prefix ? `${this.prefix}:${prefix}` : prefix;

		return new CacheStore(this.kv, this.trace, newPrefix);
	}
}
