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

export type TracerOptions = {
	app: string;
	version: string;
};

export interface ITracer {
	withSpan<T>(
		name: string,
		fn: (span: Span, ctx: Context) => Promise<T>,
		attrs?: Attributes,
		ctx?: Context,
		options?: SpanOptions
	): Promise<T>;
	recordError(span: Span, err: unknown): Promise<void>;
	getTracer(): OTelTracer;
	getActiveSpan(): Span | undefined;
	extractContext(headers: Headers | Record<string, string>): Context;
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

	/**
	 * Extracts context from incoming headers (e.g., from a Hono request).
	 * This is the "bridge" for distributed tracing.
	 */
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

	withSpan<T>(
		name: string,
		fn: (span: Span, ctx: Context) => Promise<T>,
		attrs?: Attributes,
		ctx?: Context,
		options?: SpanOptions
	): Promise<T> {
		// 1. Determine the starting context
		const parentContext = ctx ?? context.active();

		// 2. Start the span as "Active"
		// In CF Workers, the callback of startActiveSpan is the safest place to capture context
		return this.otelTracer.startActiveSpan(
			name,
			{ ...options, attributes: { ...attrs, ...options?.attributes } },
			parentContext,
			async (span) => {
				// 3. Create the new context explicitly for manual propagation
				const activeContext = trace.setSpan(parentContext, span);

				try {
					// 4. Pass the new context into the callback
					return await fn(span, activeContext);
				} catch (err) {
					await this.recordError(span, err);
					throw err;
				} finally {
					span.end();
				}
			}
		);
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

export function createTracer(opts: TracerOptions) {
	return new Tracer(opts);
}
