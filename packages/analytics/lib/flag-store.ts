import type { ICacheStore } from "@zero-heads-lab/cache/interface";
import type {
	FlagDefinitionCacheData,
	FlagDefinitionCacheProvider,
} from "posthog-node/experimental";

export class CloudflareKVFlagCache implements FlagDefinitionCacheProvider {
	protected cache: ICacheStore;
	protected projectKey: string;

	constructor(projectApiKey: string, cacheStore: ICacheStore) {
		this.projectKey = projectApiKey;
		this.cache = cacheStore;
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

export class CloudflareKVFlagCacheReader extends CloudflareKVFlagCache {
	shouldFetchFlagDefinitions() {
		return false;
	}

	// biome-ignore lint/suspicious/useAwait: no awited action
	async onFlagDefinitionsReceived(): Promise<void> {
		throw new Error(
			"CloudflareKVFlagCacheReader is read-only and cannot store flag definitions."
		);
	}
}

export class CloudflareKVFlagCacheWriter extends CloudflareKVFlagCache {
	getFlagDefinitions() {
		return Promise.resolve(undefined);
	}

	shouldFetchFlagDefinitions() {
		return true;
	}
}
