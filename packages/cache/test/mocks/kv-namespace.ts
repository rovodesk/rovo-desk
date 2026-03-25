/** biome-ignore-all lint/suspicious/useAwait: No await needed for mock*/
import { vi } from "vitest";

export type MockKVNamespace = KVNamespace & {
	store: Map<string, string>;
	getSpy: ReturnType<typeof vi.fn>;
	putSpy: ReturnType<typeof vi.fn>;
	deleteSpy: ReturnType<typeof vi.fn>;
	listSpy: ReturnType<typeof vi.fn>;
	clear(): void;
};

export function createMockKVNamespace(): MockKVNamespace {
	const store = new Map<string, string>();

	const getSpy = vi.fn();
	const putSpy = vi.fn();
	const deleteSpy = vi.fn();
	const listSpy = vi.fn();

	return {
		async get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream") {
			getSpy(key, type);

			const value = store.get(key);
			if (value == null) return null;

			if (type === "json") return JSON.parse(value);
			if (type === "arrayBuffer") return new TextEncoder().encode(value).buffer;
			if (type === "stream") {
				return new ReadableStream({
					start(controller) {
						controller.enqueue(new TextEncoder().encode(value));
						controller.close();
					},
				});
			}

			return value;
		},

		async put(key: string, value: string) {
			putSpy(key, value);
			store.set(key, value);
		},

		async delete(key: string) {
			deleteSpy(key);
			store.delete(key);
		},

		async list() {
			listSpy();
			return {
				keys: Array.from(store.keys()).map((name) => ({
					name,
					expiration: undefined,
					metadata: null,
				})),
				list_complete: true,
				cursor: "",
			};
		},

		store,
		getSpy,
		putSpy,
		deleteSpy,
		listSpy,

		clear() {
			store.clear();
			getSpy.mockClear();
			putSpy.mockClear();
			deleteSpy.mockClear();
			listSpy.mockClear();
		},
	} as unknown as MockKVNamespace;
}
