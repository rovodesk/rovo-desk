import { vi } from "vitest";
import type { AuthContext, ILogger } from "../../lib/logger";

export type MockLogEntry = {
	level: "info" | "warn" | "error" | "debug";
	message: string;
	data?: Record<string, unknown>;
	error?: unknown;
	critical?: boolean;
	context: Record<string, unknown>;
	auth: AuthContext;
};

export type MockLogger = ILogger & {
	entries: MockLogEntry[];
	contextState: Record<string, unknown>;
	authState: AuthContext;

	setContextSpy: ReturnType<typeof vi.fn>;
	setTraceContextSpy: ReturnType<typeof vi.fn>;
	setAuthContextSpy: ReturnType<typeof vi.fn>;
	infoSpy: ReturnType<typeof vi.fn>;
	warnSpy: ReturnType<typeof vi.fn>;
	errorSpy: ReturnType<typeof vi.fn>;
	debugSpy: ReturnType<typeof vi.fn>;

	lastEntry?: MockLogEntry;
	clear(): void;
};

export function createMockLogger(): MockLogger {
	const entries: MockLogEntry[] = [];
	let contextState: Record<string, unknown> = {};
	let authState: AuthContext = {};

	const setContextSpy = vi.fn();
	const setTraceContextSpy = vi.fn();
	const setAuthContextSpy = vi.fn();
	const infoSpy = vi.fn();
	const warnSpy = vi.fn();
	const errorSpy = vi.fn();
	const debugSpy = vi.fn();

	const pushEntry = (entry: Omit<MockLogEntry, "context" | "auth">) => {
		entries.push({
			...entry,
			context: { ...contextState },
			auth: { ...authState },
		});
	};

	const logger: MockLogger = {
		setContext(ctx) {
			setContextSpy(ctx);
			contextState = { ...contextState, ...ctx };
		},

		setTraceContext(traceId?: string, spanId?: string) {
			setTraceContextSpy(traceId, spanId);
			contextState = {
				...contextState,
				traceId,
				spanId,
			};
		},

		setAuthContext(auth) {
			setAuthContextSpy(auth);
			authState = { ...authState, ...auth };
		},

		info(message, data) {
			infoSpy(message, data);
			pushEntry({
				level: "info",
				message,
				data,
			});
		},

		debug(message, data) {
			debugSpy(message, data);
			pushEntry({
				level: "debug",
				message,
				data,
			});
		},

		warn(critical, message, data) {
			warnSpy(critical, message, data);
			pushEntry({
				level: "warn",
				message,
				data,
				critical,
			});
		},

		error(message, err, data) {
			errorSpy(message, err, data);
			pushEntry({
				level: "error",
				message,
				data,
				error: err,
			});
		},

		get entries() {
			return entries;
		},

		get contextState() {
			return contextState;
		},

		get authState() {
			return authState;
		},

		get lastEntry() {
			return entries.at(-1);
		},

		clear() {
			entries.length = 0;
			contextState = {};
			authState = {};
			setContextSpy.mockClear();
			setTraceContextSpy.mockClear();
			setAuthContextSpy.mockClear();
			infoSpy.mockClear();
			warnSpy.mockClear();
			errorSpy.mockClear();
			debugSpy.mockClear();
		},

		setContextSpy,
		setTraceContextSpy,
		setAuthContextSpy,
		infoSpy,
		warnSpy,
		errorSpy,
		debugSpy,
	};

	return logger;
}
