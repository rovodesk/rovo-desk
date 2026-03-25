/** biome-ignore-all lint/suspicious/useAwait: MOCKS DO NOT NEED TO BE ASYNC */

import { vi } from "vitest";
import type { IAnalytics } from "../../lib/analytics";

export type MockAnalyticsEntry =
	| {
			type: "event";
			userId: string;
			event: string;
			properties?: Record<string, unknown>;
	  }
	| {
			type: "exception";
			error: unknown;
			userId?: string;
			properties?: Record<string, unknown>;
	  }
	| {
			type: "identify";
			userId: string;
			anonId: string;
			properties?: Record<string, unknown>;
	  };

export type MockAnalytics = IAnalytics & {
	entries: MockAnalyticsEntry[];

	captureEventSpy: ReturnType<typeof vi.fn>;
	captureExceptionSpy: ReturnType<typeof vi.fn>;
	identifySpy: ReturnType<typeof vi.fn>;
	shutdownSpy: ReturnType<typeof vi.fn>;

	lastEntry?: MockAnalyticsEntry;
	clear(): void;
};

export function createMockAnalytics(): MockAnalytics {
	const entries: MockAnalyticsEntry[] = [];

	const captureEventSpy = vi.fn();
	const captureExceptionSpy = vi.fn();
	const identifySpy = vi.fn();
	const shutdownSpy = vi.fn();

	const analytics: MockAnalytics = {
		async captureEvent(userId, event, properties) {
			captureEventSpy(userId, event, properties);

			entries.push({
				type: "event",
				userId,
				event,
				properties,
			});
		},

		captureException(error, userId, properties) {
			captureExceptionSpy(error, userId, properties);

			entries.push({
				type: "exception",
				error,
				userId,
				properties,
			});
		},

		identify(userId, anonId, properties) {
			identifySpy(userId, anonId, properties);

			entries.push({
				type: "identify",
				userId,
				anonId,
				properties,
			});
		},

		async shutdown(timeout) {
			shutdownSpy(timeout);
		},

		get entries() {
			return entries;
		},

		get lastEntry() {
			return entries.at(-1);
		},

		clear() {
			entries.length = 0;
			captureEventSpy.mockClear();
			captureExceptionSpy.mockClear();
			identifySpy.mockClear();
			shutdownSpy.mockClear();
		},

		captureEventSpy,
		captureExceptionSpy,
		identifySpy,
		shutdownSpy,
	};

	return analytics;
}
