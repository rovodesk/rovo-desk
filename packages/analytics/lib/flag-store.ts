import { KvCacheStore } from "@zero-heads-lab/cache";
import type {
	FlagDefinitionCacheData,
	FlagDefinitionCacheProvider,
} from "posthog-node/experimental";

class CloudflareKVFlagCache implements FlagDefinitionCacheProvider {
	protected cache: KvCacheStore;
	protected projectKey: string;

	constructor(kv: KVNamespace, projectApiKey: string) {
		this.projectKey = projectApiKey;
		this.cache = new KvCacheStore(kv).withPrefix("posthog").withPrefix("flags");
	}

	protected get cacheKey() {
		return this.projectKey;
	}

	async getFlagDefinitions(): Promise<FlagDefinitionCacheData | undefined> {
		try {
			const cached = await this.cache.get<FlagDefinitionCacheData>(
				this.cacheKey
			);
			return cached ?? undefined;
		} catch {
			return undefined;
		}
	}

	shouldFetchFlagDefinitions() {
		return false;
	}

	async onFlagDefinitionsReceived(data: FlagDefinitionCacheData) {
		await this.cache.set(this.cacheKey, data);
	}

	shutdown() {
		// no-op
	}
}

// Reader cache that only ever reads from KV and never writes.
// This can be used in request handlers to provide read-only access
// to flag definitions.
export class CloudflareKVFlagCacheReader extends CloudflareKVFlagCache {
	shouldFetchFlagDefinitions() {
		// Never fetch from the read only cache. Returning false here means
		// that we'll never be asked to write flag definitions to cache.
		return false;
	}

	// biome-ignore lint/suspicious/useAwait: No Awaited function
	async onFlagDefinitionsReceived(): Promise<void> {
		// This shouldn't ever happen.
		throw new Error(
			"CloudflareKVFlagCacheReader is read-only and cannot store flag definitions."
		);
	}
}

// Writer cache that always fetches fresh flag definitions and overwrites existing cache.
// Used in scheduled jobs to refresh the cache periodically.
export class CloudflareKVFlagCacheWriter extends CloudflareKVFlagCache {
	getFlagDefinitions() {
		// Always return undefined to force fetching fresh flag definitions.
		return Promise.resolve(undefined);
	}

	shouldFetchFlagDefinitions() {
		// Assume we don't need any distributed coordination. We can run this in a
		// cron job on a single scheduled worker.
		return true;
	}
}
