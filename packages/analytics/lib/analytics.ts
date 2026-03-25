import type { PostHog } from "posthog-node";
import { getPostHogClient } from "./posthog";

export interface IAnalytics {
	captureEvent(
		userId: string,
		event: string,
		properties?: Record<string, unknown>
	): void;

	captureException(
		error: unknown,
		userId?: string,
		properties?: Record<string, unknown>
	): void;

	identify(
		userId: string,
		anonId: string,
		properties?: Record<string, unknown>
	): void;

	shutdown(timeout?: number): Promise<void>;
}

export type AnalyticsOptions = {
	posthogApiKey: string;
	posthogHost: string;
	flagCache: KVNamespace;
	posthogClient?: PostHog;
};

export class Analytics implements IAnalytics {
	private readonly posthog: PostHog;

	constructor(opts: AnalyticsOptions) {
		this.posthog =
			opts.posthogClient ??
			getPostHogClient(opts.flagCache, opts.posthogApiKey, opts.posthogHost);
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

	async shutdown(timeout?: number) {
		await this.posthog.shutdown(timeout);
	}
}
