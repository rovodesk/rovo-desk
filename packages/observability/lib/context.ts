import { AsyncLocalStorage } from "node:async_hooks";
import type { LogContext } from "./types.js";

const storage = new AsyncLocalStorage<LogContext>();

export const runWithContext = <T>(ctx: LogContext, fn: () => T): T => {
	return storage.run(ctx, fn);
};

export const getContext = (): LogContext => {
	return storage.getStore() ?? {};
};

export const setContext = (ctx: Partial<LogContext>): void => {
	const store = storage.getStore();
	if (!store) return;

	Object.assign(store, ctx);
};

export const clearContext = (): void => {
	const store = storage.getStore();
	if (!store) return;

	for (const key of Object.keys(store)) {
		delete store[key];
	}
};
