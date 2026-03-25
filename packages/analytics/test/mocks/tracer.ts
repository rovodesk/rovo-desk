import {
	type Attributes,
	context,
	type Span,
	type SpanContext,
	type SpanStatus,
	type TimeInput,
} from "@opentelemetry/api";
import { vi } from "vitest";
import type { ITracer } from "../../lib/tracer";

export type MockSpan = Span & {
	__state: {
		name?: string;
		attributes: Record<string, unknown>;
		events: Array<{
			name: string;
			attributes?: Attributes;
		}>;
		links: unknown[];
		status?: SpanStatus;
		exceptions: unknown[];
		ended: boolean;
		recording: boolean;
		context: SpanContext;
	};
};

export function createMockSpan(overrides?: {
	traceId?: string;
	spanId?: string;
}): MockSpan {
	const state = {
		name: "",
		attributes: {} as Record<string, unknown>,
		events: [] as Array<{ name: string; attributes?: Attributes }>,
		links: [] as unknown[],
		status: undefined as SpanStatus | undefined,
		exceptions: [] as unknown[],
		ended: false,
		recording: true,
		context: {
			traceId: overrides?.traceId ?? "11111111111111111111111111111111",
			spanId: overrides?.spanId ?? "2222222222222222",
			traceFlags: 1,
			isRemote: false,
		},
	};

	const span: MockSpan = {
		__state: state,

		spanContext: vi.fn(() => state.context),

		setAttribute: vi.fn((key: string, value: unknown) => {
			state.attributes[key] = value;
			return span;
		}),

		setAttributes: vi.fn((attrs: Attributes) => {
			for (const [key, value] of Object.entries(attrs)) {
				state.attributes[key] = value;
			}
			return span;
		}),

		addEvent: vi.fn((name: string, attributes?: Attributes) => {
			state.events.push({ name, attributes });
			return span;
		}),

		addLink: vi.fn((link) => {
			state.links.push(link);
			return span;
		}),

		addLinks: vi.fn((links) => {
			state.links.push(...links);
			return span;
		}),

		setStatus: vi.fn((status: SpanStatus) => {
			state.status = status;
			return span;
		}),

		updateName: vi.fn((name: string) => {
			state.name = name;
			return span;
		}),

		end: vi.fn((_endTime?: TimeInput) => {
			state.ended = true;
			state.recording = false;
		}),

		isRecording: vi.fn(() => state.recording),

		recordException: vi.fn((exception: unknown) => {
			state.exceptions.push(exception);
		}),
	};

	return span;
}

export type MockTracer = ITracer & {
	__state: {
		spans: MockSpan[];
		started: Array<{
			name: string;
			attrs?: Attributes;
			span: MockSpan;
			startTime: number;
		}>;
		ended: Array<{
			name: string;
			attrs?: Attributes;
			span: MockSpan;
			startTime: number;
		}>;
		recordedErrors: Array<{
			name: string;
			err: unknown;
			span: MockSpan;
			startTime: number;
		}>;
	};
};

export function createMockTracer(): ITracer & {
	lastSpan?: ReturnType<typeof createMockSpan>;
	withSpanSpy: ReturnType<typeof vi.fn>;
	startSpanSpy: ReturnType<typeof vi.fn>;
	endSpanSpy: ReturnType<typeof vi.fn>;
	recordErrorSpy: ReturnType<typeof vi.fn>;
} {
	let lastSpan: ReturnType<typeof createMockSpan> | undefined;

	// ✅ real generic implementation
	const withSpanImpl = async <T>(
		name: string,
		fn: (span: Span) => Promise<T>,
		attrs?: Attributes
	): Promise<T> => {
		const span = createMockSpan();
		lastSpan = span;

		if (attrs) {
			for (const [k, v] of Object.entries(attrs)) {
				if (v !== undefined) {
					span.setAttribute(k, v);
				}
			}
		}

		try {
			return await fn(span);
		} catch (err) {
			span.updateName(`${name}.error`);
			span.recordException(err as Error);
			span.setStatus({
				code: 2,
				message: err instanceof Error ? err.message : String(err),
			});
			throw err;
		} finally {
			span.end();
		}
	};

	// spies (optional, for assertions)
	const withSpanSpy = vi.fn(withSpanImpl);
	const startSpanSpy = vi.fn();
	const endSpanSpy = vi.fn();
	const recordErrorSpy = vi.fn();

	return {
		// 👇 IMPORTANT: expose the real typed function, not the raw Mock type
		withSpan: withSpanImpl,

		startSpan: (name, attrs) => {
			startSpanSpy(name, attrs);

			const span = createMockSpan();
			lastSpan = span;

			if (attrs) {
				for (const [k, v] of Object.entries(attrs)) {
					if (v !== undefined) {
						span.setAttribute(k, v);
					}
				}
			}

			return {
				span,
				ctx: context.active(),
				name,
				startTime: Date.now(),
			};
		},

		endSpan: (spanObj, attrs) => {
			endSpanSpy(spanObj, attrs);
			spanObj.span.end();
		},

		// biome-ignore lint/suspicious/useAwait: No awaited function
		recordError: async (spanObj, err) => {
			recordErrorSpy(spanObj, err);
			spanObj.span.recordException(err);
			spanObj.span.setStatus({
				code: 2,
				message: err instanceof Error ? err.message : String(err),
			});
		},

		// expose spies for tests
		withSpanSpy,
		startSpanSpy,
		endSpanSpy,
		recordErrorSpy,

		get lastSpan() {
			return lastSpan;
		},
	};
}
