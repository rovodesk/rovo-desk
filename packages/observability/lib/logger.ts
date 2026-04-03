import { trace } from "@opentelemetry/api";
import type {
	LoggerOptions as PinoBaseOptions,
	Logger as PinoLogger,
} from "pino";
import pino from "pino";

export interface ILogger {
	withContext(ctx: Record<string, unknown>): ILogger;
	withTrace(traceId?: string, spanId?: string): ILogger;
	withUser(userId?: string, workspaceId?: string, roleId?: string): ILogger;
	error(message: string, err?: unknown, data?: Record<string, unknown>): void;
	warn(message: string, data?: Record<string, unknown>): void;
	info(message: string, data?: Record<string, unknown>): void;
	log(message: string, data?: Record<string, unknown>): void;
	debug(message: string, data?: Record<string, unknown>): void;
}

export type LogContext = {
	requestId?: string;
	traceId?: string;
	spanId?: string;
	userId?: string;
	workspaceId?: string;
	roleId?: string;
	[key: string]: unknown;
};

export type LogLevel =
	| "silent"
	| "fatal"
	| "error"
	| "warn"
	| "info"
	| "debug"
	| "trace";

const LOG_LEVELS: Record<LogLevel, number> = {
	silent: 0,
	fatal: 10,
	error: 20,
	warn: 30,
	info: 40,
	debug: 50,
	trace: 60,
};

const DEFAULT_LOG_LEVEL: LogLevel = "info";

export interface LoggerOptions {
	level?: LogLevel;
	debug?: boolean;
	context?: LogContext;
	pinoInstance?: PinoLogger;
	mode?: "pretty" | "json";
	prettyOptions?: {
		colorize?: boolean;
		translateTime?: boolean | string;
		ignore?: string;
		singleLine?: boolean;
		messageFormat?: string;
	};
	app?: string;
	version?: string;
}

export class Logger implements ILogger {
	private readonly pino: PinoLogger;
	private readonly debugMode: boolean;
	private readonly options?: LoggerOptions;

	constructor(opts?: LoggerOptions) {
		this.debugMode = opts?.debug ?? false;
		this.options = opts;
		// decide transport
		const transport =
			opts?.mode === "pretty"
				? {
						target: "pino-pretty",
						options: {
							colorize: true,
							translateTime: "HH:MM:ss",
							ignore: "pid,hostname",
							singleLine: false,
							...opts?.prettyOptions,
						},
					}
				: undefined;

		const pinoOptions: PinoBaseOptions = {
			base: opts?.app
				? {
						app: opts.app,
						version: opts.version,
					}
				: null,
			timestamp: pino.stdTimeFunctions.epochTime,
			customLevels: LOG_LEVELS,
			useOnlyCustomLevels: true,
			level: opts?.level ?? DEFAULT_LOG_LEVEL,
			formatters: {
				level: (label) => ({ level: label }),
			},
			...(transport ? { transport } : {}),
		};
		this.pino = opts?.pinoInstance ?? pino(pinoOptions);
	}

	//Object Cleaner for logs
	private cleanObject(obj: Record<string, unknown>) {
		return Object.fromEntries(
			Object.entries(obj).filter(([, value]) => value !== undefined)
		);
	}

	private getTraceContext() {
		const span = trace.getActiveSpan();
		const spanContext = span?.spanContext();

		const isValidTraceId =
			spanContext?.traceId &&
			spanContext.traceId !== "00000000000000000000000000000000";

		const isValidSpanId =
			spanContext?.spanId && spanContext.spanId !== "0000000000000000";

		return {
			traceId: isValidTraceId ? spanContext?.traceId : undefined,
			spanId: isValidSpanId ? spanContext?.spanId : undefined,
		};
	}

	private enrich(data?: Record<string, unknown>) {
		const traceCtx = this.getTraceContext();
		return {
			...traceCtx,
			...data,
		};
	}

	withContext(ctx: LogContext): ILogger {
		const mergedContext = {
			...(this.options?.context ?? {}),
			...ctx,
		};
		return new Logger({
			...this.options,
			context: mergedContext,
			pinoInstance: this.pino.child(ctx),
		});
	}

	withTrace(traceId?: string, spanId?: string): ILogger {
		return this.withContext({ traceId, spanId });
	}

	withUser(userId?: string, workspaceId?: string, roleId?: string): ILogger {
		return this.withContext({ userId, workspaceId, roleId });
	}

	private normalizeError(err: unknown) {
		if (err && typeof err === "object") {
			const e = err as {
				message?: unknown;
				name?: unknown;
				stack?: unknown;
				code?: unknown;
			};

			return {
				message:
					typeof e.message === "string" ? e.message : JSON.stringify(err),
				name: typeof e.name === "string" ? e.name : "Error",
				code:
					typeof e.code === "string" || typeof e.code === "number"
						? e.code
						: undefined,
				stack:
					this.debugMode && typeof e.stack === "string" ? e.stack : undefined,
			};
		}

		return {
			message: typeof err === "string" ? err : String(err),
			name: "Error",
		};
	}

	error(message: string, err?: unknown, data?: Record<string, unknown>) {
		this.pino.error(
			this.enrich({
				...this.cleanObject(data ?? {}),
				error: err ? this.normalizeError(err) : undefined,
				message,
			})
		);
	}

	warn(message: string, data?: Record<string, unknown>) {
		this.pino.warn(
			this.enrich({
				...this.cleanObject(data ?? {}),
				message,
			})
		);
	}

	info(message: string, data?: Record<string, unknown>) {
		this.pino.info(
			this.enrich({
				...this.cleanObject(data ?? {}),
				message,
			})
		);
	}

	log(message: string, data?: Record<string, unknown>) {
		this.pino.trace(
			this.enrich({
				...this.cleanObject(data ?? {}),
				message,
			})
		);
	}

	debug(message: string, data?: Record<string, unknown>) {
		this.pino.debug(
			this.enrich({
				...this.cleanObject(data ?? {}),
				message,
			})
		);
	}
}
