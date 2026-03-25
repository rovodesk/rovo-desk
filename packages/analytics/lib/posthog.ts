import { PostHog, type PostHogOptions } from "posthog-node";
import { CloudflareKVFlagCacheReader } from "./flag-store";

let posthog: PostHog | undefined;

export function getPostHogClient(
	cache: KVNamespace,
	posthogApiKey: string,
	posthogHost: string
): PostHog {
	if (!posthog) {
		const options: PostHogOptions = {
			host: posthogHost,
			flagDefinitionCacheProvider: new CloudflareKVFlagCacheReader(
				cache,
				posthogApiKey
			),
			flushAt: 1,
			flushInterval: 0,
		};

		posthog = new PostHog(posthogApiKey, options);
	}

	return posthog;
}
