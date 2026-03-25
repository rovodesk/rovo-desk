import pino from "pino";
import { keys } from "@/server/keys";
import type { IAnalytics } from "./analytics";

export type AuthContext = {
	sessionId?: string;
	userId?: string;
	orgId?: string;
	role?: string | string[];
};

export interface ILogger {
	setContext(ctx: Record<string, unknown>): void;
	setTraceContext(traceId?: string, spanId?: string): void;
	setAuthContext(auth: AuthContext): void;
	info(message: string, data?: Record<string, unknown>): void;
	warn(
		critical: boolean,
		message: string,
		data?: Record<string, unknown>
	): void;
	error(message: string, err?: unknown, data?: Record<string, unknown>): void;
	debug(message: string, data?: Record<string, unknown>): void;
}

export type LoggerOptions = {
	logLevel?: string;
	enableAnalytics?: boolean;
	analytics?: IAnalytics;
};

export class Logger implements ILogger {
	private readonly pino: pino.Logger;
	private context: Record<string, unknown> = {};
	private auth: AuthContext = {};
	private readonly analytics?: IAnalytics;
	private readonly enableAnalytics: boolean;

	constructor(opts?: LoggerOptions) {
		this.pino = pino({
			level: opts?.logLevel ?? keys.LOG_LEVEL ?? "info",
			base: null,
			timestamp: pino.stdTimeFunctions.epochTime,
			formatters: {
				level: (label) => ({ level: label }),
			},
		});

		this.analytics = opts?.analytics;
		this.enableAnalytics = opts?.enableAnalytics ?? false;
	}

	/**
	 * Set persistent context for the current request lifecycle
	 */
	setContext(ctx: Record<string, unknown>) {
		this.context = { ...this.context, ...ctx };
	}

	setTraceContext(traceId?: string, spanId?: string) {
		this.context.traceId = traceId;
		this.context.spanId = spanId;
	}

	setAuthContext(auth: AuthContext) {
		this.auth = { ...this.auth, ...auth };
	}

	private normalizeError(err: unknown) {
		if (err && typeof err === "object") {
			const e = err as {
				message?: unknown;
				name?: unknown;
				stack?: unknown;
				code?: unknown;
				cause?: unknown;
			};

			return {
				message:
					typeof e.message === "string" ? e.message : JSON.stringify(err),
				name: typeof e.name === "string" ? e.name : "Error",
				code: typeof e.code === "string" ? e.code : undefined,
				stack:
					process.env.NODE_ENV === "development" && typeof e.stack === "string"
						? e.stack
						: undefined,
				cause: e.cause,
			};
		}

		return {
			message: typeof err === "string" ? err : String(err),
			name: "Error",
		};
	}

	// --- Core Logging Methods ---

	info(message: string, data?: Record<string, unknown>) {
		this.pino.info({
			...this.context,
			auth: this.auth,
			...data,
			message,
		});
	}

	debug(message: string, data?: Record<string, unknown>) {
		this.pino.debug({
			...this.context,
			auth: this.auth,
			...data,
			message,
		});
	}

	warn(critical: boolean, message: string, data?: Record<string, unknown>) {
		this.pino.warn({
			...this.context,
			auth: this.auth,
			...data,
			critical,
			message,
		});

		if (this.enableAnalytics && critical && this.analytics) {
			this.analytics.captureEvent("system", "warn_critical", {
				message,
				...this.context,
				...data,
			});
		}
	}

	error(message: string, err?: unknown, data?: Record<string, unknown>) {
		const errorInfo = err ? this.normalizeError(err) : undefined;

		this.pino.error({
			...this.context,
			auth: this.auth,
			...data,
			error: errorInfo,
			message,
		});

		if (this.enableAnalytics && this.analytics) {
			const properties = { ...this.context, ...data, message };
			if (err instanceof Error) {
				this.analytics.captureException(err, this.auth.userId, properties);
			} else {
				this.analytics.captureEvent(
					this.auth.userId ?? "system",
					"error",
					properties
				);
			}
		}
	}

	/**
	 * Creates a child instance with inherited context.
	 * Useful if you want to pass a sub-logger to a specific service.
	 */
	derive(ctx: Record<string, unknown>) {
		const newLogger = new Logger({
			analytics: this.analytics,
			enableAnalytics: this.enableAnalytics,
			logLevel: this.pino.level,
		});
		newLogger.setContext({ ...this.context, ...ctx });
		newLogger.setAuthContext(this.auth);
		return newLogger;
	}
}
