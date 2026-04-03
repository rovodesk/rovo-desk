import type { ICacheStore } from "@zero-heads-lab/cache/lib/interface";
import { PostHog, type PostHogOptions } from "posthog-node";
import { CloudflareKVFlagCacheReader } from "./flag-store";

let posthog: PostHog | undefined;

export function getPostHogClient(
	posthogApiKey: string,
	posthogHost: string,
	cache?: ICacheStore
): PostHog {
	if (!posthog) {
		const options: PostHogOptions = {
			host: posthogHost,
			flagDefinitionCacheProvider: cache
				? new CloudflareKVFlagCacheReader(
						posthogApiKey,
						cache.withPrefix("posthog").withPrefix("flags")
					)
				: undefined,
			flushAt: 1,
			flushInterval: 0,
		};

		posthog = new PostHog(posthogApiKey, options);
	}

	return posthog;
}

// test helper
export function __resetPostHogClientForTests() {
	posthog = undefined;
}
