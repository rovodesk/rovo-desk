import { PostHog, type PostHogOptions } from "posthog-node";
import { CloudflareKVFlagCacheReader } from "../lib/flag-store";
import { keys } from "./keys";

let posthog: PostHog | undefined;

// biome-ignore lint/suspicious/useAwait: no Awaited Function
export async function getAnalyticsClient(
	cache: KVNamespace,
	projectApiKey: string
): Promise<PostHog> {
	if (!posthog) {
		const options: PostHogOptions = {
			host: keys.POSTHOG_HOST,
			flagDefinitionCacheProvider: new CloudflareKVFlagCacheReader(
				cache,
				projectApiKey
			),
			flushAt: 1, // Send events immediately in edge environment
			flushInterval: 0, // Don't wait for interval
		};

		posthog = new PostHog(keys.POSTHOG_TOKEN, options);
	}

	return posthog;
}
