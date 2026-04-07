import pino, { type Logger as PinoLogger } from "pino";
import { v4 as uuidv4 } from "uuid";
import { getContext } from "./context.js";
import { type OTLPExporterOptions, OTLPLogExporter } from "./otlp.js";
import { getTraceContext } from "./tracer.js";
import type { LoggerOptions, LogLevel, LogPayload } from "./types.js";

export abstract class ILogger {
	abstract trace(message: string, data?: Record<string, unknown>): void;
	abstract debug(message: string, data?: Record<string, unknown>): void;
	abstract info(message: string, data?: Record<string, unknown>): void;
	abstract warn(message: string, data?: Record<string, unknown>): void;
	abstract error(
		message: string,
		data?: Record<string, unknown>,
		err?: unknown
	): void;
	abstract fatal(
		message: string,
		data?: Record<string, unknown>,
		err?: unknown
	): void;
	abstract child(context: Record<string, unknown>): ILogger;
	abstract flush(): Promise<void>;
	abstract shutdown(): Promise<void>;
}

export type LoggerConfig = LoggerOptions & {
	redactKeys?: string[];
	otlp?: Omit<OTLPExporterOptions, "url" | "resourceAttributes">;
};

export class Logger implements ILogger {
	private readonly pino: PinoLogger;
	private readonly exporter?: OTLPLogExporter;
	private readonly app: string;
	private readonly version?: string;
	private readonly bindings: Record<string, unknown>;
	private readonly level: LogLevel;
	private readonly otlpUrl?: string;
	private readonly redactKeys: string[];

	constructor(
		options: LoggerConfig,
		bindings: Record<string, unknown> = {},
		pinoInstance?: PinoLogger
	) {
		this.app = options.app;
		this.version = options.version;
		this.bindings = bindings;
		this.level = options.level ?? "info";
		this.otlpUrl = options.otlpUrl;
		this.redactKeys = options.redactKeys ?? [
			"password",
			"token",
			"accessToken",
			"refreshToken",
			"authorization",
			"cookie",
			"idToken",
			"secret",
		];

		this.pino =
			pinoInstance ??
			pino({
				level: this.level,
				base: undefined,
				timestamp: pino.stdTimeFunctions.isoTime,
				redact: this.redactKeys,
			});

		if (this.otlpUrl) {
			this.exporter = new OTLPLogExporter({
				url: this.otlpUrl,
				...(options.otlp ?? {}),
				resourceAttributes: {
					"service.name": this.app,
					"service.version": this.version ?? "1.0.0",
				},
			});
		}
	}

	child(context: Record<string, unknown>): ILogger {
		return new Logger(
			{
				app: this.app,
				version: this.version,
				level: this.level,
				otlpUrl: this.otlpUrl,
				redactKeys: this.redactKeys,
			},
			{
				...this.bindings,
				...context,
			},
			this.pino.child(context)
		);
	}

	private cleanObject(obj: Record<string, unknown>) {
		return Object.fromEntries(
			Object.entries(obj).filter(([, value]) => value !== undefined)
		);
	}

	private redact(value: unknown): unknown {
		if (Array.isArray(value)) {
			return value.map((item) => this.redact(item));
		}

		if (value && typeof value === "object") {
			return Object.fromEntries(
				Object.entries(value as Record<string, unknown>).map(([key, val]) => [
					key,
					this.redactKeys.includes(key) ? "[REDACTED]" : this.redact(val),
				])
			);
		}

		return value;
	}

	private normalizeError(err: unknown) {
		if (!err) return undefined;

		if (err instanceof Error) {
			return {
				name: err.name,
				message: err.message,
				stack: err.stack,
			};
		}

		if (typeof err === "object") return this.redact(err);

		return { message: String(err) };
	}

	private enrich(payload: LogPayload) {
		const asyncContext = getContext();
		const traceContext = getTraceContext();

		return this.cleanObject(
			this.redact({
				...this.bindings,
				...asyncContext,
				...traceContext,
				...payload,
				traceId: traceContext.traceId ?? asyncContext.traceId ?? uuidv4(),
				spanId: traceContext.spanId ?? asyncContext.spanId,
				app: this.app,
				version: this.version,
				timestamp: new Date().toISOString(),
			}) as Record<string, unknown>
		);
	}

	private write(level: LogLevel, payload: LogPayload) {
		const enriched = this.enrich(payload);

		this.pino[level](enriched);

		if (this.exporter) {
			this.exporter.export({
				level,
				...enriched,
			});
		}
	}

	trace(message: string, data?: Record<string, unknown>) {
		this.write("trace", { message, ...(data ?? {}) });
	}

	debug(message: string, data?: Record<string, unknown>) {
		this.write("debug", { message, ...(data ?? {}) });
	}

	info(message: string, data?: Record<string, unknown>) {
		this.write("info", { message, ...(data ?? {}) });
	}

	warn(message: string, data?: Record<string, unknown>) {
		this.write("warn", { message, ...(data ?? {}) });
	}

	error(message: string, data?: Record<string, unknown>, err?: unknown) {
		this.write("error", {
			message,
			...(data ?? {}),
			error: this.normalizeError(err),
		});
	}

	fatal(message: string, data?: Record<string, unknown>, err?: unknown) {
		this.write("fatal", {
			message,
			...(data ?? {}),
			error: this.normalizeError(err),
		});
	}

	async flush(): Promise<void> {
		if (this.exporter) {
			await this.exporter.flush();
		}
	}

	async shutdown(): Promise<void> {
		if (this.exporter) {
			await this.exporter.shutdown();
		}
	}
}

export function createLogger(options: LoggerConfig) {
	return new Logger(options);
}
