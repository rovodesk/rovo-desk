import type {
	ILogger,
	ITracer,
} from "@zero-heads-lab/observability/lib/server";

export interface ICacheStore {
	get<T = unknown>(key: string): Promise<T | null>;
	set(key: string, value: unknown, ttl?: number): Promise<void>;
	list(listOptions?: {
		limit?: number;
		cursor?: string;
	}): Promise<KVNamespaceListResult<unknown, string>>;
	delete(key: string): Promise<void>;
	withPrefix(prefix: string): ICacheStore;
	getPrefix(): string;
}

export class CacheStore implements ICacheStore {
	private readonly kv: KVNamespace;
	private readonly prefix?: string;
	private readonly logger: ILogger;
	private readonly tracer: ITracer;
	static readonly CACHE_TTL = 3600; // 1 hour

	constructor(
		kv: KVNamespace,
		logger: ILogger,
		tracer: ITracer,
		prefix?: string
	) {
		this.kv = kv;
		this.prefix = prefix;
		this.logger = logger;
		this.tracer = tracer;
	}

	// Key function to set key and prefix
	private readonly key = (key: string) => {
		return this.prefix ? `${this.prefix}:${key}` : key;
	};

	get = async <T = unknown>(key: string): Promise<T | null> => {
		return await this.tracer.withSpan("cache.get", async (span) => {
			const fullKey = this.key(key);
			span.setAttribute("cache.key", fullKey);

			const value = await this.kv.get<T>(fullKey, "json");
			if (!value) {
				this.logger.info("Cache miss", {
					key: fullKey,
					prefix: this.prefix,
				});
			}

			return value;
		});
	};

	set = async (key: string, value: unknown, ttl?: number): Promise<void> => {
		return await this.tracer.withSpan("cache.set", async (span) => {
			const fullKey = this.key(key);
			span.setAttribute("cache.key", fullKey);

			this.logger.info("Cache set", {
				key: fullKey,
				prefix: this.prefix,
				ttl: ttl ?? CacheStore.CACHE_TTL,
			});

			await this.kv.put(fullKey, JSON.stringify(value), {
				expirationTtl: ttl ?? CacheStore.CACHE_TTL,
			});
		});
	};

	delete = async (key: string): Promise<void> => {
		return await this.tracer.withSpan("cache.delete", async (span) => {
			const fullKey = this.key(key);
			span.setAttribute("cache.key", fullKey);

			await this.kv.delete(fullKey);

			this.logger.info("Cache delete", {
				key: fullKey,
				prefix: this.prefix,
			});
		});
	};

	list = async (listOptions?: {
		limit?: number;
		cursor?: string;
	}): Promise<KVNamespaceListResult<unknown, string>> => {
		return await this.tracer.withSpan("cache.list", async (span) => {
			const prefix = this.prefix ? `${this.prefix}:` : undefined;

			if (prefix) {
				span.setAttribute("cache.prefix", prefix);
			}

			const result = await this.kv.list({
				limit: listOptions?.limit,
				prefix,
				cursor: listOptions?.cursor,
			});

			this.logger.info("Cache list", { prefix });

			return result;
		});
	};

	withPrefix = (prefix: string): ICacheStore => {
		const newPrefix = this.prefix ? `${this.prefix}:${prefix}` : prefix;
		return new CacheStore(this.kv, this.logger, this.tracer, newPrefix);
	};

	getPrefix = (): string => {
		return this.prefix || "";
	};
}
