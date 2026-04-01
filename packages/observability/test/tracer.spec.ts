import { context, SpanStatusCode, trace } from "@opentelemetry/api";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTraceContext, Tracer } from "../lib/tracer";
import { createMockOTelTracer, createMockSpan } from "./mocks/otel-tracer.mock";

describe("Tracer", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("constructs with trace.getTracer(app, version)", () => {
		const mockTracer = createMockOTelTracer();

		const getTracerSpy = vi
			.spyOn(trace, "getTracer")
			.mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		expect(getTracerSpy).toHaveBeenCalledWith("auth-service", "1.2.3");
		expect(tracer.getTracer()).toBe(mockTracer.tracer);
	});

	it("getActiveSpan returns trace.getActiveSpan()", () => {
		const mockTracer = createMockOTelTracer();
		const activeSpan = createMockSpan();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);
		vi.spyOn(trace, "getActiveSpan").mockReturnValue(activeSpan);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		expect(tracer.getActiveSpan()).toBe(activeSpan);
	});

	it("startSpan delegates to otel tracer", () => {
		const mockTracer = createMockOTelTracer();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		const customContext = context.active();
		const options = { root: true };

		const span = tracer.startSpan("db.query", customContext, options);

		expect(mockTracer.startSpanSpy).toHaveBeenCalledWith(
			"db.query",
			options,
			customContext
		);
		expect(span).toBe(mockTracer.lastSpan);
	});

	it("withSpan creates an active span and applies attributes", async () => {
		const mockTracer = createMockOTelTracer();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		const result = await tracer.withSpan(
			"http.request",
			// biome-ignore lint/suspicious/useAwait: No awaitable function is used
			async (span) => {
				expect(span).toBe(mockTracer.lastSpan);
				return "ok";
			},
			{
				"http.method": "GET",
				"http.route": "/health",
				"skip.me": undefined,
			}
		);

		expect(result).toBe("ok");
		expect(mockTracer.startActiveSpanSpy).toHaveBeenCalledTimes(1);

		const span = mockTracer.lastSpan!;
		expect(span.setAttributeSpy).toHaveBeenCalledWith("http.method", "GET");
		expect(span.setAttributeSpy).toHaveBeenCalledWith("http.route", "/health");
		expect(span.setAttributeSpy).not.toHaveBeenCalledWith("skip.me", undefined);
		expect(span.endSpy).toHaveBeenCalledTimes(1);
	});

	it("withSpan uses provided context", async () => {
		const mockTracer = createMockOTelTracer();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		const customContext = context.active();

		await tracer.withSpan(
			"custom.span",
			async () => "ok",
			undefined,
			{ root: true },
			customContext
		);

		expect(mockTracer.startActiveSpanSpy).toHaveBeenCalledWith(
			"custom.span",
			{ root: true },
			customContext,
			expect.any(Function)
		);
	});

	it("withSpan falls back to context.active()", async () => {
		const mockTracer = createMockOTelTracer();
		const activeContext = context.active();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		await tracer.withSpan("fallback.ctx", async () => "ok");

		expect(mockTracer.startActiveSpanSpy).toHaveBeenCalledWith(
			"fallback.ctx",
			{},
			activeContext,
			expect.any(Function)
		);
	});

	it("withSpan records errors, rethrows, and ends the span", async () => {
		const mockTracer = createMockOTelTracer();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		const err = new Error("boom");

		await expect(
			tracer.withSpan("failing.span", () => {
				throw err;
			})
		).rejects.toThrow("boom");

		const span = mockTracer.lastSpan!;
		expect(span.recordExceptionSpy).toHaveBeenCalledWith(err);
		expect(span.setStatusSpy).toHaveBeenCalledWith({
			code: SpanStatusCode.ERROR,
			message: "boom",
		});
		expect(span.endSpy).toHaveBeenCalledTimes(1);
	});

	it("endSpan applies attributes and ends the span", () => {
		const mockTracer = createMockOTelTracer();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		const span = createMockSpan();

		tracer.endSpan(span, {
			"http.status_code": 200,
			"skip.me": undefined,
		});

		expect(span.setAttributeSpy).toHaveBeenCalledWith("http.status_code", 200);
		expect(span.setAttributeSpy).not.toHaveBeenCalledWith("skip.me", undefined);
		expect(span.endSpy).toHaveBeenCalledTimes(1);
	});

	it("recordError handles Error", async () => {
		const mockTracer = createMockOTelTracer();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		const span = createMockSpan();
		const err = new Error("boom");

		await tracer.recordError(span, err);

		expect(span.recordExceptionSpy).toHaveBeenCalledWith(err);
		expect(span.setStatusSpy).toHaveBeenCalledWith({
			code: SpanStatusCode.ERROR,
			message: "boom",
		});
	});

	it("recordError handles string", async () => {
		const mockTracer = createMockOTelTracer();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		const span = createMockSpan();

		await tracer.recordError(span, "something bad");

		expect(span.recordExceptionSpy).toHaveBeenCalledWith({
			message: "something bad",
		});
		expect(span.setStatusSpy).toHaveBeenCalledWith({
			code: SpanStatusCode.ERROR,
			message: "something bad",
		});
	});

	it("recordError handles object", async () => {
		const mockTracer = createMockOTelTracer();

		vi.spyOn(trace, "getTracer").mockReturnValue(mockTracer.tracer);

		const tracer = new Tracer({
			app: "auth-service",
			version: "1.2.3",
		});

		const span = createMockSpan();

		await tracer.recordError(span, { reason: "bad" });

		expect(span.recordExceptionSpy).toHaveBeenCalledWith({
			message: JSON.stringify({ reason: "bad" }),
		});
		expect(span.setStatusSpy).toHaveBeenCalledWith({
			code: SpanStatusCode.ERROR,
			message: JSON.stringify({ reason: "bad" }),
		});
	});
});

describe("getTraceContext", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("returns valid trace and span ids", () => {
		const span = createMockSpan({
			traceId: "1234567890abcdef1234567890abcdef",
			spanId: "1234567890abcdef",
		});

		vi.spyOn(trace, "getActiveSpan").mockReturnValue(span);

		expect(getTraceContext()).toEqual({
			traceId: "1234567890abcdef1234567890abcdef",
			spanId: "1234567890abcdef",
		});
	});

	it("returns undefined for invalid trace ids", () => {
		const span = createMockSpan({
			traceId: "00000000000000000000000000000000",
			spanId: "0000000000000000",
		});

		vi.spyOn(trace, "getActiveSpan").mockReturnValue(span);

		expect(getTraceContext()).toEqual({
			traceId: undefined,
			spanId: undefined,
		});
	});

	it("returns undefined when no active span exists", () => {
		vi.spyOn(trace, "getActiveSpan").mockReturnValue(undefined);

		expect(getTraceContext()).toEqual({
			traceId: undefined,
			spanId: undefined,
		});
	});
});
