import type { ICacheStore } from "@zero-heads-lab/cache/lib/interface";
import type { FlagEvaluationOptions, PostHog } from "posthog-node";
import type { AnalyticsEnv } from "../server/keys";
import type { IAnalytics } from "../types";
import { getPostHogClient } from "./posthog";

export type AnalyticsOptions = AnalyticsEnv & {
	env: AnalyticsEnv;
	cacheStore?: ICacheStore;
	posthogClient?: PostHog;
};

export class Analytics implements IAnalytics {
	private readonly posthog: PostHog;

	constructor(opts: AnalyticsOptions) {
		if (!(opts.env.POSTHOG_API_KEY && opts.env.POSTHOG_HOST)) {
			throw new Error("Missing PostHog API key or host");
		}

		this.posthog =
			opts.posthogClient ??
			getPostHogClient(
				opts.env.POSTHOG_API_KEY,
				opts.env.POSTHOG_HOST,
				opts.cacheStore
			);
	}

	// biome-ignore lint/suspicious/useAwait: No Awaited function
	async captureEvent(
		userId: string,
		event: string,
		properties?: Record<string, unknown>
	) {
		this.posthog.capture({
			distinctId: userId,
			event,
			properties,
		});
	}

	captureException(
		error: unknown,
		userId?: string,
		properties?: Record<string, unknown>
	) {
		if (error instanceof Error) {
			this.posthog.captureException(error, userId, {
				properties,
			});
		} else {
			this.posthog.capture({
				distinctId: userId,
				event: "error",
				properties: {
					message: String(error),
					...properties,
				},
			});
		}
	}

	identify(
		userId: string,
		anonId: string,
		properties?: Record<string, unknown>
	) {
		this.posthog.alias({
			distinctId: userId,
			alias: anonId,
		});

		this.posthog.identify({
			distinctId: userId,
			properties: {
				...properties,
				$anon_id: anonId,
			},
		});
	}

	async getFeatureFlag({
		featureFlag,
		options,
	}: {
		featureFlag: string;
		options?: FlagEvaluationOptions;
	}) {
		return await this.posthog.getFeatureFlagResult(featureFlag, options);
	}

	async shutdown(timeout?: number) {
		await this.posthog.shutdown(timeout);
	}
}
