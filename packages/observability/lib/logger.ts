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
	error(message: string, data?: Record<string, unknown>, err?: unknown): void;
	warn(message: string, data?: Record<string, unknown>): void;
	info(message: string, data?: Record<string, unknown>): void;
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
	private readonly context: LogContext;

	constructor(opts?: LoggerOptions) {
		this.debugMode = opts?.debug ?? false;
		this.context = opts?.context ?? {};

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
				: undefined,
			timestamp: pino.stdTimeFunctions.isoTime,
			level: opts?.level ?? DEFAULT_LOG_LEVEL,
			formatters: {
				level: (label) => ({ level: label }),
			},
			...(transport ? { transport } : {}),
		};

		this.pino = opts?.pinoInstance ?? pino(pinoOptions);
	}

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
		return this.cleanObject({
			...this.context,
			...this.getTraceContext(),
			...data,
		});
	}

	private normalizeError(err: unknown) {
		if (err instanceof Error) {
			return {
				name: err.name,
				message: err.message,
				stack: this.debugMode ? err.stack : undefined,
			};
		}

		return {
			name: "Error",
			message: typeof err === "string" ? err : String(err),
		};
	}

	withContext(ctx: LogContext): ILogger {
		return new Logger({
			debug: this.debugMode,
			context: {
				...this.context,
				...ctx,
			},
			pinoInstance: this.pino,
		});
	}

	withTrace(traceId?: string, spanId?: string): ILogger {
		return this.withContext({ traceId, spanId });
	}

	withUser(userId?: string, workspaceId?: string, roleId?: string): ILogger {
		return this.withContext({ userId, workspaceId, roleId });
	}

	error(message: string, data?: Record<string, unknown>, err?: unknown) {
		this.pino.error(
			this.enrich({
				message,
				...this.cleanObject(data ?? {}),
				error: err ? this.normalizeError(err) : undefined,
			})
		);
	}

	warn(message: string, data?: Record<string, unknown>) {
		this.pino.warn(
			this.enrich({
				message,
				...this.cleanObject(data ?? {}),
			})
		);
	}

	info(message: string, data?: Record<string, unknown>) {
		this.pino.info(
			this.enrich({
				message,
				...this.cleanObject(data ?? {}),
			})
		);
	}

	debug(message: string, data?: Record<string, unknown>) {
		this.pino.debug(
			this.enrich({
				message,
				...this.cleanObject(data ?? {}),
			})
		);
	}
}
