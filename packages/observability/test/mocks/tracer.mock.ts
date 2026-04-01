import type {
	Attributes,
	Context,
	Tracer as OTelTracer,
	Span,
	SpanOptions,
} from "@opentelemetry/api";
import { SpanStatusCode } from "@opentelemetry/api";
import { type Mock, vi } from "vitest";
import type { ITracer } from "../../lib/tracer";

export type MockSpan = Span & {
	name: string;
	attributes: Record<string, unknown>;
	ended: boolean;
	recordedErrors: unknown[];
	status?: {
		code: number;
		message?: string;
	};

	setAttributeSpy: ReturnType<typeof vi.fn>;
	endSpy: ReturnType<typeof vi.fn>;
	recordExceptionSpy: ReturnType<typeof vi.fn>;
	setStatusSpy: ReturnType<typeof vi.fn>;
	spanContextSpy: ReturnType<typeof vi.fn>;
};

export type MockTracer = ITracer & {
	withSpanSpy: Mock<ITracer["withSpan"]> & ITracer["withSpan"];
	startSpanSpy: Mock<ITracer["startSpan"]>;
	endSpanSpy: Mock<ITracer["endSpan"]>;
	recordErrorSpy: Mock<ITracer["recordError"]>;
	getTracerSpy: Mock<ITracer["getTracer"]>;
	getActiveSpanSpy: Mock<ITracer["getActiveSpan"]>;

	tracer: OTelTracer;
	startActiveSpanSpy: Mock<OTelTracer["startActiveSpan"]>;
	otelStartSpanSpy: Mock<OTelTracer["startSpan"]>;

	spans: MockSpan[];
	lastSpan?: MockSpan;

	clear(): void;
};

export function createMockSpan(
	name = "mock.span",
	overrides?: Partial<ReturnType<Span["spanContext"]>>
): MockSpan {
	const attributes: Record<string, unknown> = {};
	const recordedErrors: unknown[] = [];
	let ended = false;
	let status: MockSpan["status"] | undefined;

	const setAttributeSpy = vi.fn((key: string, value: unknown) => {
		attributes[key] = value;
	});

	const endSpy = vi.fn(() => {
		ended = true;
	});

	const recordExceptionSpy = vi.fn((err: unknown) => {
		recordedErrors.push(err);
	});

	const setStatusSpy = vi.fn(
		(nextStatus: { code: number; message?: string }) => {
			status = nextStatus;
		}
	);

	const spanContextSpy = vi.fn(() => ({
		traceId: "trace_123",
		spanId: "span_456",
		traceFlags: 1,
		...overrides,
	}));

	const span = {
		setAttribute: setAttributeSpy,
		end: endSpy,
		recordException: recordExceptionSpy,
		setStatus: setStatusSpy,
		spanContext: spanContextSpy,
	} as unknown as Partial<Span>;

	return {
		...(span as Span),
		name,
		get attributes() {
			return attributes;
		},
		get ended() {
			return ended;
		},
		get recordedErrors() {
			return recordedErrors;
		},
		get status() {
			return status;
		},
		setAttributeSpy,
		endSpy,
		recordExceptionSpy,
		setStatusSpy,
		spanContextSpy,
	} as MockSpan;
}

export function createMockTracer(): MockTracer {
	const spans: MockSpan[] = [];
	let activeSpan: MockSpan | undefined;

	const otelStartSpanSpy = vi.fn(
		(name: string, _options?: SpanOptions, _ctx?: Context): Span => {
			const span = createMockSpan(name);
			spans.push(span);
			activeSpan = span;
			return span;
		}
	);

	const startActiveSpanSpy = vi.fn(
		(
			name: string,
			_options: SpanOptions,
			_ctx: Context,
			fn: (span: Span) => unknown
		) => {
			const span = createMockSpan(name);
			spans.push(span);
			activeSpan = span;
			return fn(span);
		}
	);

	const otelTracer = {
		startSpan: otelStartSpanSpy,
		startActiveSpan: startActiveSpanSpy,
	} as unknown as OTelTracer;

	const getTracerSpy = vi.fn(() => otelTracer);

	const getActiveSpanSpy = vi.fn(() => activeSpan);

	const startSpanSpy = vi.fn(
		(name: string, _ctx?: Context, _options?: SpanOptions): Span => {
			const span = createMockSpan(name);
			spans.push(span);
			activeSpan = span;
			return span;
		}
	);

	const endSpanSpy = vi.fn((span: Span, attrs?: Attributes) => {
		if (attrs) {
			for (const [key, value] of Object.entries(attrs)) {
				if (value !== undefined) {
					span.setAttribute(key, value);
				}
			}
		}
		span.end();
		if (activeSpan === span) {
			activeSpan = undefined;
		}
	});

	// biome-ignore lint/suspicious/useAwait: No awaited fn
	const recordErrorSpy = vi.fn(async (span: Span, err: unknown) => {
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
	});

	const withSpanSpy = vi.fn<ITracer["withSpan"]>(
		async <T>(
			name: string,
			fn: (span: Span) => Promise<T>,
			attrs?: Attributes,
			_options?: SpanOptions,
			_ctx?: Context
		): Promise<T> => {
			const span = createMockSpan(name);
			spans.push(span);
			activeSpan = span;

			try {
				if (attrs) {
					for (const [key, value] of Object.entries(attrs)) {
						if (value !== undefined) {
							span.setAttribute(key, value);
						}
					}
				}

				return await fn(span);
			} catch (err) {
				await recordErrorSpy(span, err);
				throw err;
			} finally {
				endSpanSpy(span);
			}
		}
	) as unknown as Mock<ITracer["withSpan"]> & ITracer["withSpan"];

	const tracer: MockTracer = {
		withSpan: withSpanSpy,
		startSpan: startSpanSpy,
		endSpan: endSpanSpy,
		recordError: recordErrorSpy,
		getTracer: getTracerSpy,
		getActiveSpan: getActiveSpanSpy,

		tracer: otelTracer,
		startActiveSpanSpy,
		otelStartSpanSpy,

		withSpanSpy,
		startSpanSpy,
		endSpanSpy,
		recordErrorSpy,
		getTracerSpy,
		getActiveSpanSpy,

		get spans() {
			return spans;
		},

		get lastSpan() {
			return spans.at(-1);
		},

		clear() {
			spans.length = 0;
			activeSpan = undefined;
			withSpanSpy.mockClear();
			startSpanSpy.mockClear();
			endSpanSpy.mockClear();
			recordErrorSpy.mockClear();
			getTracerSpy.mockClear();
			getActiveSpanSpy.mockClear();
			otelStartSpanSpy.mockClear();
			startActiveSpanSpy.mockClear();
		},
	};

	return tracer;
}
