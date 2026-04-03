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
	setAttributesSpy: ReturnType<typeof vi.fn>;
	endSpy: ReturnType<typeof vi.fn>;
	recordExceptionSpy: ReturnType<typeof vi.fn>;
	setStatusSpy: ReturnType<typeof vi.fn>;
	spanContextSpy: ReturnType<typeof vi.fn>;
	isRecordingSpy: ReturnType<typeof vi.fn>;
	addEventSpy: ReturnType<typeof vi.fn>;
	updateNameSpy: ReturnType<typeof vi.fn>;
};

export type MockTracer = ITracer & {
	withSpanSpy: Mock<ITracer["withSpan"]> & ITracer["withSpan"];
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
		return span;
	});

	const setAttributesSpy = vi.fn((attrs: Attributes) => {
		for (const [key, value] of Object.entries(attrs)) {
			if (value !== undefined) {
				attributes[key] = value;
			}
		}
		return span;
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
			return span;
		}
	);

	const spanContextSpy = vi.fn(() => ({
		traceId: "1234567890abcdef1234567890abcdef",
		spanId: "1234567890abcdef",
		traceFlags: 1,
		...overrides,
	}));

	const isRecordingSpy = vi.fn(() => true);
	const addEventSpy = vi.fn(() => span);
	const updateNameSpy = vi.fn(() => span);

	const span = {
		setAttribute: setAttributeSpy,
		setAttributes: setAttributesSpy,
		end: endSpy,
		recordException: recordExceptionSpy,
		setStatus: setStatusSpy,
		spanContext: spanContextSpy,
		isRecording: isRecordingSpy,
		addEvent: addEventSpy,
		updateName: updateNameSpy,
	} as unknown as Span;

	return {
		...span,
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
		setAttributesSpy,
		endSpy,
		recordExceptionSpy,
		setStatusSpy,
		spanContextSpy,
		isRecordingSpy,
		addEventSpy,
		updateNameSpy,
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
		async <T>(
			name: string,
			_options: SpanOptions,
			_ctx: Context,
			fn: (span: Span) => T | Promise<T>
		): Promise<T> => {
			const span = createMockSpan(name);
			spans.push(span);
			activeSpan = span;

			try {
				return await fn(span);
			} finally {
				span.end();
				activeSpan = undefined;
			}
		}
	);

	const otelTracer = {
		startSpan: otelStartSpanSpy,
		startActiveSpan: startActiveSpanSpy,
	} as unknown as OTelTracer;

	const getTracerSpy = vi.fn(() => otelTracer);

	const getActiveSpanSpy = vi.fn(() => activeSpan);

	// biome-ignore lint/suspicious/useAwait: Matches real tracer contract
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
			fn: (span: Span, ctx: Context) => Promise<T>,
			attrs?: Attributes,
			ctxArg?: Context,
			options?: SpanOptions
		): Promise<T> => {
			const parentContext = ctxArg ?? context.active();
			const span = createMockSpan(name);
			spans.push(span);
			activeSpan = span;

			try {
				if (attrs || options?.attributes) {
					span.setAttributes({
						...(attrs ?? {}),
						...(options?.attributes ?? {}),
					});
				}

				const activeCtx = trace.setSpan(parentContext, span);

				return await fn(span, activeCtx);
			} catch (err) {
				await recordErrorSpy(span, err);
				throw err;
			} finally {
				span.end();
				activeSpan = undefined;
			}
		}
	) as unknown as Mock<ITracer["withSpan"]> & ITracer["withSpan"];

	const tracer: MockTracer = {
		withSpan: withSpanSpy,
		recordError: recordErrorSpy,
		getTracer: getTracerSpy,
		getActiveSpan: getActiveSpanSpy,
		extractContext: vi.fn((headers: Headers | Record<string, string>) => {
			const headerObj: Record<string, string> = {};
			if (headers instanceof Headers) {
				headers.forEach((v, k) => {
					headerObj[k] = v;
				});
			} else {
				Object.assign(headerObj, headers);
			}
			return headerObj as unknown as Context;
		}),

		tracer: otelTracer,
		startActiveSpanSpy,
		otelStartSpanSpy,

		withSpanSpy,
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
			recordErrorSpy.mockClear();
			getTracerSpy.mockClear();
			getActiveSpanSpy.mockClear();
			otelStartSpanSpy.mockClear();
			startActiveSpanSpy.mockClear();
		},
	};

	return tracer;
}
