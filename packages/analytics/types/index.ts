import type { Attributes, Context, Span } from "@opentelemetry/api";
import type z from "zod";
import type { AuthContext } from "../lib/logger";
import type { logLevelSchema } from "../server/keys";

export type Event = {
	name: string;
	properties?: Record<string, unknown>;
};

export type LogLevel = z.infer<typeof logLevelSchema>;

export interface IAnalytics {
	captureEvent(
		userId: string,
		event: string,
		properties?: Record<string, unknown>
	): void;

	captureException(
		error: unknown,
		userId?: string,
		properties?: Record<string, unknown>
	): void;

	identify(
		userId: string,
		anonId: string,
		properties?: Record<string, unknown>
	): void;

	shutdown(timeout?: number): Promise<void>;
}

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
	derive(ctx: Record<string, unknown>): ILogger;
}

export interface ITracer {
	withSpan<T>(
		name: string,
		fn: (span: Span) => Promise<T>,
		attrs?: Attributes
	): Promise<T>;
	startSpan(
		name: string,
		attrs?: Attributes
	): {
		span: Span;
		ctx: Context;
		name: string;
		startTime: number;
	};
	endSpan(
		spanObj: {
			span: Span;
			name: string;
			startTime: number;
		},
		attrs?: Attributes
	): void;
	recordError(
		spanObj: {
			span: Span;
			name: string;
			startTime: number;
		},
		// biome-ignore lint/suspicious/noExplicitAny: Error Can be of any type
		err: any
	): Promise<void>;
}

export type Attributions = {
	utm_source: string | null;
	utm_medium: string | null;
	utm_campaign: string | null;
	utm_term: string | null;
	utm_content: string | null;
	gclid: string | null;
	fbclid: string | null;
	referrer: string | null;
	timestamp: Date;
};
