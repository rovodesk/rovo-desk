import pino from "pino";
import type { AnalyticsEnv } from "../server/keys";
import type { IAnalytics, ILogger } from "../types";

export type AuthContext = {
	sessionId?: string;
	userId?: string;
	orgId?: string;
	role?: string | string[];
};

const DEFAULT_LOG_LEVEL = "info";

export type LoggerOptions = {
	env: AnalyticsEnv;
	analytics: IAnalytics;
};

export class Logger implements ILogger {
	private readonly pino: pino.Logger;
	private context: Record<string, unknown> = {};
	private auth: AuthContext = {};
	private readonly analytics: IAnalytics;
	private readonly env: AnalyticsEnv;

	constructor(opts: LoggerOptions) {
		this.pino = pino({
			level: opts.env.LOG_LEVEL ?? DEFAULT_LOG_LEVEL,
			base: null,
			timestamp: pino.stdTimeFunctions.epochTime,
			formatters: {
				level: (label) => ({ level: label }),
			},
		});

		this.analytics = opts.analytics;
		this.env = opts.env;
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
					this.env.DEBUG && typeof e.stack === "string" ? e.stack : undefined,
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

		if (this.env.ANALYTICS_ENABLED && critical && this.analytics) {
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

		if (this.env.ANALYTICS_ENABLED && this.analytics) {
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
			env: this.env,
			analytics: this.analytics,
		});
		newLogger.setContext({ ...this.context, ...ctx });
		newLogger.setAuthContext(this.auth);
		return newLogger;
	}
}
