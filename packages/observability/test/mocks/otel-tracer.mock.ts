import type {
	Context,
	Tracer as OTelTracer,
	Span,
	SpanOptions,
} from "@opentelemetry/api";
import { vi } from "vitest";

export type MockSpan = Span & {
	setAttributeSpy: ReturnType<typeof vi.fn>;
	endSpy: ReturnType<typeof vi.fn>;
	recordExceptionSpy: ReturnType<typeof vi.fn>;
	setStatusSpy: ReturnType<typeof vi.fn>;
	spanContextSpy: ReturnType<typeof vi.fn>;
};

export type MockOTelTracer = {
	tracer: OTelTracer;
	startSpanSpy: ReturnType<typeof vi.fn>;
	startActiveSpanSpy: ReturnType<typeof vi.fn>;
	lastSpan?: MockSpan;
};

export function createMockSpan(
	overrides?: Partial<ReturnType<Span["spanContext"]>>
): MockSpan {
	const setAttributeSpy = vi.fn();
	const endSpy = vi.fn();
	const recordExceptionSpy = vi.fn();
	const setStatusSpy = vi.fn();

	const spanContextSpy = vi.fn(() => ({
		traceId: "1234567890abcdef1234567890abcdef",
		spanId: "1234567890abcdef",
		traceFlags: 1,
		...overrides,
	}));

	const span = {
		setAttribute: setAttributeSpy,
		end: endSpy,
		recordException: recordExceptionSpy,
		setStatus: setStatusSpy,
		spanContext: spanContextSpy,
	} as Partial<Span>;

	return {
		...(span as Span),
		setAttributeSpy,
		endSpy,
		recordExceptionSpy,
		setStatusSpy,
		spanContextSpy,
	} as MockSpan;
}

export function createMockOTelTracer(): MockOTelTracer {
	let lastSpan: MockSpan | undefined;

	const startSpanSpy = vi.fn(
		(_name: string, _options?: SpanOptions, _ctx?: Context) => {
			lastSpan = createMockSpan();
			return lastSpan;
		}
	);

	const startActiveSpanSpy = vi.fn(
		async (
			_name: string,
			_options: SpanOptions,
			_ctx: Context,
			fn: (span: Span) => unknown
		) => {
			lastSpan = createMockSpan();
			return await fn(lastSpan);
		}
	);

	const tracer = {} as Partial<OTelTracer>;

	Object.assign(tracer, {
		startSpan: startSpanSpy,
		startActiveSpan: startActiveSpanSpy,
	});

	return {
		tracer: tracer as OTelTracer,
		startSpanSpy,
		startActiveSpanSpy,
		get lastSpan() {
			return lastSpan;
		},
	};
}
