/** biome-ignore-all lint/suspicious/useAwait: MOCKS NEED NO AWAIT */
import { vi } from "vitest";

export type MockKvCacheStore = {
	store: Map<string, unknown>;
	prefixes: string[];

	getSpy: ReturnType<typeof vi.fn>;
	setSpy: ReturnType<typeof vi.fn>;
	deleteSpy: ReturnType<typeof vi.fn>;
	withPrefixSpy: ReturnType<typeof vi.fn>;

	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T, ttl?: number): Promise<void>;
	delete(key: string): Promise<void>;
	withPrefix(prefix: string): MockKvCacheStore;
	clear(): void;
};

export function createMockKvCacheStore(
	initialPrefixes: string[] = [],
	sharedStore = new Map<string, unknown>()
): MockKvCacheStore {
	const prefixes = [...initialPrefixes];

	const getSpy = vi.fn();
	const setSpy = vi.fn();
	const deleteSpy = vi.fn();
	const withPrefixSpy = vi.fn();

	const resolveKey = (key: string) => [...prefixes, key].join(":");

	const mock: MockKvCacheStore = {
		store: sharedStore,
		prefixes,

		async get<T>(key: string): Promise<T | null> {
			getSpy(key);
			const value = sharedStore.get(resolveKey(key));
			return (value as T | undefined) ?? null;
		},

		async set<T>(key: string, value: T): Promise<void> {
			setSpy(key, value);
			sharedStore.set(resolveKey(key), value);
		},

		async delete(key: string): Promise<void> {
			deleteSpy(key);
			sharedStore.delete(resolveKey(key));
		},

		withPrefix(prefix: string): MockKvCacheStore {
			withPrefixSpy(prefix);
			return createMockKvCacheStore([...prefixes, prefix], sharedStore);
		},

		clear() {
			sharedStore.clear();
			getSpy.mockClear();
			setSpy.mockClear();
			deleteSpy.mockClear();
			withPrefixSpy.mockClear();
		},

		getSpy,
		setSpy,
		deleteSpy,
		withPrefixSpy,
	};

	return mock;
}
