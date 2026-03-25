import { createMockKvCacheStore } from "@zero-heads-lab/cache/test/mocks/cache-store";
import { createMockKVNamespace } from "@zero-heads-lab/cache/test/mocks/kv-namespace";
import { describe, expect, it } from "vitest";
import {
	CloudflareKVFlagCache,
	CloudflareKVFlagCacheReader,
	CloudflareKVFlagCacheWriter,
} from "../../lib/flag-store";

describe("CloudflareKVFlagCache", () => {
	it("returns cached flag definitions when present", async () => {
		const kv = createMockKVNamespace();
		const cache = createMockKvCacheStore(["posthog", "flags"]);

		const data = {
			flags: [{ key: "beta-feature" }],
		} as any;

		await cache.set("project-key", data);

		const flagCache = new CloudflareKVFlagCache(
			kv,
			"project-key",
			cache as any
		);

		const result = await flagCache.getFlagDefinitions();

		expect(result).toEqual(data);
	});

	it("returns undefined when cache throws", async () => {
		const kv = createMockKVNamespace();

		const brokenCache = {
			// biome-ignore lint/suspicious/useAwait: No awaited funcction
			get: async () => {
				throw new Error("KV failed");
			},
			set: async () => {
				// No Operation
			},
			withPrefix: () => brokenCache,
		};

		const flagCache = new CloudflareKVFlagCache(
			kv,
			"project-key",
			brokenCache as any
		);

		const result = await flagCache.getFlagDefinitions();

		expect(result).toBeUndefined();
	});

	it("writes flag definitions into cache", async () => {
		const kv = createMockKVNamespace();
		const cache = createMockKvCacheStore(["posthog", "flags"]);

		const data = {
			flags: [{ key: "new-feature" }],
		} as any;

		const flagCache = new CloudflareKVFlagCache(
			kv,
			"project-key",
			cache as any
		);

		await flagCache.onFlagDefinitionsReceived(data);

		expect(await cache.get("project-key")).toEqual(data);
	});

	it("does not fetch by default", () => {
		const kv = createMockKVNamespace();
		const cache = createMockKvCacheStore(["posthog", "flags"]);

		const flagCache = new CloudflareKVFlagCache(
			kv,
			"project-key",
			cache as any
		);

		expect(flagCache.shouldFetchFlagDefinitions()).toBe(false);
	});
});

describe("CloudflareKVFlagCacheReader", () => {
	it("is read-only and throws on write", async () => {
		const kv = createMockKVNamespace();
		const cache = createMockKvCacheStore(["posthog", "flags"]);

		const reader = new CloudflareKVFlagCacheReader(
			kv,
			"project-key",
			cache as any
		);

		await expect(reader.onFlagDefinitionsReceived()).rejects.toThrow(
			"read-only"
		);
	});

	it("never fetches fresh definitions", () => {
		const kv = createMockKVNamespace();
		const cache = createMockKvCacheStore(["posthog", "flags"]);

		const reader = new CloudflareKVFlagCacheReader(
			kv,
			"project-key",
			cache as any
		);

		expect(reader.shouldFetchFlagDefinitions()).toBe(false);
	});
});

describe("CloudflareKVFlagCacheWriter", () => {
	it("always forces fresh fetch", async () => {
		const kv = createMockKVNamespace();
		const cache = createMockKvCacheStore(["posthog", "flags"]);

		const writer = new CloudflareKVFlagCacheWriter(
			kv,
			"project-key",
			cache as any
		);

		expect(await writer.getFlagDefinitions()).toBeUndefined();
		expect(writer.shouldFetchFlagDefinitions()).toBe(true);
	});
});
