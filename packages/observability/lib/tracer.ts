import {
	type Attributes,
	type Context,
	context,
	type Tracer as OTelTracer,
	type Span,
	type SpanOptions,
	SpanStatusCode,
	trace,
} from "@opentelemetry/api";

export type ActiveSpan = Span;

export type TracerOptions = {
	app: string;
	version: string;
};

export interface ITracer {
	withSpan<T>(
		name: string,
		fn: (span: Span) => Promise<T>,
		attrs?: Attributes,
		options?: SpanOptions,
		ctx?: Context
	): Promise<T>;
	startSpan(name: string, ctx?: Context, options?: SpanOptions): Span;
	endSpan(span: Span, attrs?: Attributes): void;
	recordError(span: Span, err: unknown): Promise<void>;
	getTracer(): OTelTracer;
	getActiveSpan(): Span | undefined;
}

export function getTraceContext() {
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

export class Tracer implements ITracer {
	private readonly otelTracer: OTelTracer;

	constructor(opts: TracerOptions) {
		this.otelTracer = trace.getTracer(opts.app, opts.version);
	}

	getTracer() {
		return this.otelTracer;
	}

	getActiveSpan(): Span | undefined {
		return trace.getActiveSpan();
	}

	startSpan(name: string, ctx?: Context, options?: SpanOptions): Span {
		return this.otelTracer.startSpan(name, options, ctx);
	}

	// biome-ignore lint/suspicious/useAwait: No awaitable function is used
	async withSpan<T>(
		name: string,
		fn: (span: Span) => Promise<T>,
		attrs?: Attributes,
		options?: SpanOptions,
		ctx?: Context
	): Promise<T> {
		return this.otelTracer.startActiveSpan(
			name,
			options ?? {},
			ctx ?? context.active(),
			async (span) => {
				try {
					if (attrs) {
						for (const [k, v] of Object.entries(attrs)) {
							if (v !== undefined) span.setAttribute(k, v);
						}
					}

					return await fn(span);
				} catch (err) {
					await this.recordError(span, err);
					throw err;
				} finally {
					this.endSpan(span);
				}
			}
		);
	}

	endSpan(span: Span, attrs?: Attributes) {
		if (attrs) {
			for (const [k, v] of Object.entries(attrs)) {
				if (v !== undefined) span.setAttribute(k, v);
			}
		}

		span.end();
	}

	// biome-ignore lint/suspicious/useAwait: No awaitable function is used
	async recordError(span: Span, err: unknown) {
		let message = "Unknown error";

		if (err instanceof Error) {
			message = err.message;
			span.recordException(err);
		} else if (typeof err === "string") {
			message = err;
			span.recordException({ message: err });
		} else if (typeof err === "object" && err !== null) {
			message = JSON.stringify(err);
			span.recordException({ message });
		} else {
			span.recordException({ message });
		}

		span.setStatus({
			code: SpanStatusCode.ERROR,
			message,
		});
	}
}
