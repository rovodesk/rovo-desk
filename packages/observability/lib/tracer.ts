import {
	type Attributes,
	type Context,
	context,
	type Tracer as OTelTracer,
	propagation,
	type Span,
	type SpanOptions,
	SpanStatusCode,
	trace,
} from "@opentelemetry/api";
import type { TracerOptions } from "./types.js";

export abstract class ITracer {
	abstract withSpan<T>(
		name: string,
		fn: (span: Span, ctx: Context) => Promise<T>,
		attrs?: Attributes,
		ctx?: Context,
		options?: SpanOptions
	): Promise<T>;

	abstract recordError(span: Span, err: unknown): void;
	abstract getTracer(): OTelTracer;
	abstract getActiveSpan(): Span | undefined;
	abstract getActiveContext(): Context;

	abstract extractContext(headers: Headers | Record<string, string>): Context;
	abstract injectContext(
		carrier?: Record<string, string>,
		ctx?: Context
	): Record<string, string>;
}

function safeStringify(value: unknown): string {
	try {
		return JSON.stringify(value);
	} catch {
		return "[Unserializable error object]";
	}
}

export function getTraceContext() {
	const span = trace.getSpan(context.active());
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

export class Tracer implements ITracer {
	private readonly otelTracer: OTelTracer;

	constructor(opts: TracerOptions) {
		this.otelTracer = trace.getTracer(opts.app, opts.version);
	}

	getTracer(): OTelTracer {
		return this.otelTracer;
	}

	getActiveSpan(): Span | undefined {
		return trace.getSpan(context.active());
	}

	getActiveContext(): Context {
		return context.active();
	}

	extractContext(headers: Headers | Record<string, string>): Context {
		const headerObj: Record<string, string> = {};

		if (headers instanceof Headers) {
			headers.forEach((v, k) => {
				headerObj[k] = v;
			});
		} else {
			Object.assign(headerObj, headers);
		}

		return propagation.extract(context.active(), headerObj);
	}

	injectContext(
		carrier: Record<string, string> = {},
		ctx: Context = context.active()
	): Record<string, string> {
		propagation.inject(ctx, carrier);
		return carrier;
	}

	withSpan<T>(
		name: string,
		fn: (span: Span, ctx: Context) => Promise<T>,
		attrs?: Attributes,
		ctx?: Context,
		options?: SpanOptions
	): Promise<T> {
		const parentContext = ctx ?? context.active();

		return this.otelTracer.startActiveSpan(
			name,
			{
				...options,
				attributes: {
					...options?.attributes,
					...attrs,
				},
			},
			parentContext,
			async (span) => {
				const activeContext = trace.setSpan(parentContext, span);

				try {
					return await fn(span, activeContext);
				} catch (err) {
					this.recordError(span, err);
					throw err;
				} finally {
					span.end();
				}
			}
		);
	}

	recordError(span: Span, err: unknown): void {
		let message = "Unknown error";

		if (err instanceof Error) {
			message = err.message;
			span.recordException(err);
		} else if (typeof err === "string") {
			message = err;
			span.recordException({ message: err });
		} else if (typeof err === "object" && err !== null) {
			message = safeStringify(err);
			span.recordException({ message });
		} else {
			message = String(err);
			span.recordException({ message });
		}

		span.setStatus({
			code: SpanStatusCode.ERROR,
			message,
		});
	}
}

export function createTracer(opts: TracerOptions) {
	return new Tracer(opts);
}
