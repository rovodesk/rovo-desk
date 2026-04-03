import { vi } from "vitest";
import type { ILogger } from "../../lib/logger";

export type MockLogLevel = "info" | "warn" | "error" | "debug" | "trace";

export type MockLogEntry = {
	level: MockLogLevel;
	message: string;
	data?: Record<string, unknown>;
	error?: unknown;
	context: Record<string, unknown>;
};

export type MockLogger = ILogger & {
	entries: MockLogEntry[];
	contextState: Record<string, unknown>;

	withContextSpy: ReturnType<typeof vi.fn>;
	withTraceSpy: ReturnType<typeof vi.fn>;
	withUserSpy: ReturnType<typeof vi.fn>;
	infoSpy: ReturnType<typeof vi.fn>;
	warnSpy: ReturnType<typeof vi.fn>;
	errorSpy: ReturnType<typeof vi.fn>;
	debugSpy: ReturnType<typeof vi.fn>;
	logSpy: ReturnType<typeof vi.fn>;

	lastEntry?: MockLogEntry;
	clear(): void;
};

type CreateMockLoggerOptions = {
	entries?: MockLogEntry[];
	context?: Record<string, unknown>;
	spies?: {
		withContextSpy: ReturnType<typeof vi.fn>;
		withTraceSpy: ReturnType<typeof vi.fn>;
		withUserSpy: ReturnType<typeof vi.fn>;
		infoSpy: ReturnType<typeof vi.fn>;
		warnSpy: ReturnType<typeof vi.fn>;
		errorSpy: ReturnType<typeof vi.fn>;
		debugSpy: ReturnType<typeof vi.fn>;
		logSpy: ReturnType<typeof vi.fn>;
	};
};

export function createMockLogger(
	opts: CreateMockLoggerOptions = {}
): MockLogger {
	const entries = opts.entries ?? [];
	const contextState = opts.context ?? {};

	const spies = opts.spies ?? {
		withContextSpy: vi.fn(),
		withTraceSpy: vi.fn(),
		withUserSpy: vi.fn(),
		infoSpy: vi.fn(),
		warnSpy: vi.fn(),
		errorSpy: vi.fn(),
		debugSpy: vi.fn(),
		logSpy: vi.fn(),
	};

	const pushEntry = (
		level: MockLogLevel,
		message: string,
		data?: Record<string, unknown>,
		error?: unknown
	) => {
		entries.push({
			level,
			message,
			data,
			error,
			context: { ...contextState },
		});
	};

	const logger: MockLogger = {
		withContext(ctx) {
			new spies.withContextSpy(ctx);
			return createMockLogger({
				entries,
				context: {
					...contextState,
					...Object.fromEntries(
						Object.entries(ctx).filter(([, v]) => v !== undefined)
					),
				},
				spies,
			});
		},

		withTrace(traceId?: string, spanId?: string) {
			new spies.withTraceSpy(traceId, spanId);
			return logger.withContext({ traceId, spanId });
		},

		withUser(userId?: string, workspaceId?: string, roleId?: string) {
			new spies.withUserSpy(userId, workspaceId, roleId);
			return logger.withContext({ userId, workspaceId, roleId });
		},

		info(message, data) {
			new spies.infoSpy(message, data);
			pushEntry("info", message, data);
		},

		warn(message, data) {
			new spies.warnSpy(message, data);
			pushEntry("warn", message, data);
		},

		error(message, err, data) {
			new spies.errorSpy(message, err, data);
			pushEntry("error", message, data, err);
		},

		debug(message, data) {
			new spies.debugSpy(message, data);
			pushEntry("debug", message, data);
		},

		log(message, data) {
			new spies.logSpy(message, data);
			pushEntry("trace", message, data);
		},

		get entries() {
			return entries;
		},

		get contextState() {
			return { ...contextState };
		},

		get lastEntry() {
			return entries.at(-1);
		},

		clear() {
			entries.length = 0;
			spies.withContextSpy.mockClear();
			spies.withTraceSpy.mockClear();
			spies.withUserSpy.mockClear();
			spies.infoSpy.mockClear();
			spies.warnSpy.mockClear();
			spies.errorSpy.mockClear();
			spies.debugSpy.mockClear();
			spies.logSpy.mockClear();
		},

		withContextSpy: spies.withContextSpy,
		withTraceSpy: spies.withTraceSpy,
		withUserSpy: spies.withUserSpy,
		infoSpy: spies.infoSpy,
		warnSpy: spies.warnSpy,
		errorSpy: spies.errorSpy,
		debugSpy: spies.debugSpy,
		logSpy: spies.logSpy,
	};

	return logger;
}
