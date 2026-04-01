import { beforeEach, describe, expect, it, vi } from "vitest";
import { Logger } from "../lib/logger";
import { createMockPino } from "../test/mocks/pino.mock";

describe("Logger", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("logs info correctly", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
		});

		logger.info("request.completed", {
			status: 200,
		});

		expect(pino.infoSpy).toHaveBeenCalledTimes(1);
		expect(pino.infoSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "request.completed",
				status: 200,
			})
		);
	});

	it("logs warn correctly", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
		});

		logger.warn("auth.suspicious", {
			ip: "1.2.3.4",
		});

		expect(pino.warnSpy).toHaveBeenCalledTimes(1);
		expect(pino.warnSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "auth.suspicious",
				ip: "1.2.3.4",
			})
		);
	});

	it("logs debug correctly", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
		});

		logger.debug("cache.hit", {
			key: "user:1",
		});

		expect(pino.debugSpy).toHaveBeenCalledTimes(1);
		expect(pino.debugSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "cache.hit",
				key: "user:1",
			})
		);
	});

	it("logs trace via log()", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
		});

		logger.log("internal.trace", {
			foo: "bar",
		});

		expect(pino.traceSpy).toHaveBeenCalledTimes(1);
		expect(pino.traceSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "internal.trace",
				foo: "bar",
			})
		);
	});

	it("normalizes Error objects in error()", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
			debug: false,
		});

		const err = new Error("boom");

		logger.error("request.failed", err, {
			status: 500,
		});

		expect(pino.errorSpy).toHaveBeenCalledTimes(1);
		expect(pino.errorSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "request.failed",
				status: 500,
				error: expect.objectContaining({
					name: "Error",
					message: "boom",
				}),
			})
		);
	});

	it("includes stack in debug mode", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
			debug: true,
		});

		const err = new Error("boom");

		logger.error("request.failed", err);

		expect(pino.errorSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				error: expect.objectContaining({
					name: "Error",
					message: "boom",
					stack: expect.any(String),
				}),
			})
		);
	});

	it("removes undefined values from data", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
		});

		logger.info("request.completed", {
			status: 200,
			foo: undefined,
		});

		expect(pino.infoSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "request.completed",
				status: 200,
			})
		);

		const payload = pino.infoSpy.mock.calls[0];
		expect(payload).not.toHaveProperty("foo");
	});

	it("withContext creates a child logger with preserved context", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
		});

		const child = logger.withContext({
			requestId: "req_123",
			method: "GET",
		});

		child.info("request.started");

		expect(pino.childSpy).toHaveBeenCalledTimes(1);
		expect(pino.childSpy).toHaveBeenCalledWith({
			requestId: "req_123",
			method: "GET",
		});

		const childPino = pino.children[0];
		expect(childPino).toBeDefined();

		expect(childPino).toBeDefined;
		expect(childPino!.infoSpy).toHaveBeenCalledTimes(1);
		expect(childPino!.infoSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "request.started",
			})
		);

		expect(pino.infoSpy).not.toHaveBeenCalled();
	});

	it("withTrace creates a child logger with trace context", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
		});

		const child = logger.withTrace("trace_123", "span_456");
		child.info("trace.bound");

		expect(pino.childSpy).toHaveBeenCalledWith({
			traceId: "trace_123",
			spanId: "span_456",
		});
	});

	it("withUser creates a child logger with user context", () => {
		const pino = createMockPino();
		const logger = new Logger({
			pinoInstance: pino.logger,
		});

		const child = logger.withUser("user_1", "ws_1", "admin");
		child.info("auth.bound");

		expect(pino.childSpy).toHaveBeenCalledWith({
			userId: "user_1",
			workspaceId: "ws_1",
			roleId: "admin",
		});
	});
});
