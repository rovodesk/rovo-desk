import { KvCacheStore } from "./cloudflare-kv";
import type { ICacheStore } from "./interface";
import { keys } from "./keys";
import { RedisCacheStore } from "./redis";

type CacheEnv = {
	NODE_ENV?: "production" | "development";
	CACHE_KV?: KVNamespace;
};

export function createCacheStore(env: CacheEnv = {}): ICacheStore {
	const isProduction =
		env.NODE_ENV === "production" ||
		(typeof process !== "undefined" && process.env.NODE_ENV === "production");

	if (!isProduction) {
		return new RedisCacheStore(keys.REDIS_URL);
	}

	if (!env.CACHE_KV) {
		throw new Error("CACHE_KV is required in production");
	}

	return new KvCacheStore(env.CACHE_KV);
}
