import {
	type Attributes,
	context,
	type Span,
	type SpanStatusCode,
	trace,
} from "@opentelemetry/api";
import type { ITracer } from "../types";
import type { Logger } from "./logger";

export type TracerOptions = {
	app: string;
	version: string;
	logger: Logger;
};

export class Tracer implements ITracer {
	private static readonly prefix: string = "rovodesk_";
	private readonly app: string;
	private readonly version: string;
	private readonly logger: Logger;

	constructor(opts: TracerOptions) {
		this.app = opts.app;
		this.version = opts.version;
		this.logger = opts.logger;
	}

	private get tracer() {
		return trace.getTracer(Tracer.prefix + this.app, this.version);
	}

	private getSpanContext(span: Span) {
		const sc = span?.spanContext();

		// Check if IDs are actual values or just the default OTel zeros
		const isTraceValid =
			sc?.traceId && sc.traceId !== "00000000000000000000000000000000";
		const isSpanValid = sc?.spanId && sc.spanId !== "0000000000000000";

		return {
			// Fallback to a random UUID if OTel provider isn't active (common in local Wrangler)
			traceId: isTraceValid ? sc.traceId : `fb-${crypto.randomUUID()}`,
			// Fallback to a random 16-char hex for the Span ID
			spanId: isSpanValid
				? sc.spanId
				: Math.random().toString(16).substring(2, 18).padStart(16, "0"),
		};
	}

	startSpan(name: string, attrs: Attributes = {}) {
		const span = this.tracer.startSpan(name, { attributes: attrs });
		const ctx = trace.setSpan(context.active(), span);

		return { span, ctx, name, startTime: Date.now() };
	}

	// biome-ignore lint/suspicious/useAwait: No Awaited function
	async withSpan<T>(
		name: string,
		fn: (span: Span) => Promise<T>,
		attrs?: Attributes
	): Promise<T> {
		const spanObj = this.startSpan(name, attrs);

		return context.with(spanObj.ctx, async () => {
			try {
				return await fn(spanObj.span);
			} catch (err) {
				await this.recordError(spanObj, err);
				throw err;
			} finally {
				this.endSpan(spanObj);
			}
		});
	}

	endSpan(
		spanObj: {
			span: Span;
			name: string;
			startTime: number;
		},
		attrs?: Attributes
	) {
		const { span, name, startTime } = spanObj;
		const ctx = this.getSpanContext(span); // This has your IDs
		const duration = Date.now() - startTime;

		if (attrs) {
			for (const [k, v] of Object.entries(attrs)) {
				if (v !== undefined) span.setAttribute(k, v);
			}
		}

		this.logger.info("span.completed", {
			type: "span",
			span: name,
			duration: `${duration}ms`,
			traceId: ctx.traceId,
			spanId: ctx.spanId,
			...attrs,
		});

		span.end();
	}

	// biome-ignore lint/suspicious/useAwait: No Awaited function
	async recordError(
		spanObj: {
			span: Span;
			name: string;
			startTime: number;
		},
		// biome-ignore lint/suspicious/noExplicitAny: Error can be anything
		err: any
	) {
		const { span, name } = spanObj;

		let message = "Unknown error";

		if (err instanceof Error) {
			message = err.message;

			span.recordException(err);
			span.setStatus({
				code: 2 as SpanStatusCode, // ERROR code
				message,
			});
		} else {
			message = String(err);
		}

		const sc = span.spanContext();

		const payload = {
			span: name,
			message,
			traceId: sc.traceId,
			spanId: sc.spanId,
		};

		this.logger.error("span.error", payload);
	}
}
