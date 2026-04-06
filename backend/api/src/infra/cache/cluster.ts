import { CacheCluster } from "encore.dev/storage/cache";

/**
 * Shared Redis cluster for the entire backend.
 * All services reference this by name.
 */
export const sharedCache = new CacheCluster("shared-cache", {
	evictionPolicy: "allkeys-lru",
});
