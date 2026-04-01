import {
	createMockLogger,
	createMockTracer,
} from "@zero-heads-lab/observability/mocks";
import type { MiddlewareHandler } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/routes";

const authenticationMiddlewareMock = vi.fn();
const createLoggerMiddlewareMock = vi.fn();
const createTracerMiddlewareMock = vi.fn();

vi.mock("@zero-heads-lab/global/middlewares", () => ({
	authenticationMiddleware: (...args: unknown[]) =>
		authenticationMiddlewareMock(...args),
	createLoggerMiddleware: (...args: unknown[]) =>
		createLoggerMiddlewareMock(...args),
	createTracerMiddleware: (...args: unknown[]) =>
		createTracerMiddlewareMock(...args),
}));

describe("createApp routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		createTracerMiddlewareMock.mockImplementation(() => {
			const middleware: MiddlewareHandler = async (_c, next) => {
				await next();
			};
			return middleware;
		});

		createLoggerMiddlewareMock.mockImplementation(() => {
			const middleware: MiddlewareHandler = async (_c, next) => {
				await next();
			};
			return middleware;
		});

		authenticationMiddlewareMock.mockImplementation(() => {
			const middleware: MiddlewareHandler = async (c, next) => {
				c.set("auth", {
					sub: "user_123",
					email: "dev@example.com",
					org_code: "org_abc",
					permissions: ["read:me", "write:me"],
					roles: ["admin"],
					iss: "https://issuer.example.com",
					aud: "api://app",
					exp: 9_999_999_999,
					iat: 1_111_111_111,
				});
				await next();
			};
			return middleware;
		});
	});

	it("GET / returns Hello Hono!", async () => {
		const logger = createMockLogger();
		const tracer = createMockTracer();

		const app = createApp({ logger, tracer });

		const res = await app.request("/");

		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello Hono!");
	});

	it("GET /me returns authenticated user info", async () => {
		const logger = createMockLogger();
		const tracer = createMockTracer();

		const app = createApp({ logger, tracer });

		const res = await app.request("/me");

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			userId: "user_123",
			email: "dev@example.com",
			orgCode: "org_abc",
			permissions: ["read:me", "write:me"],
			roles: ["admin"],
		});
	});

	it("registers tracer and logger middleware", () => {
		const logger = createMockLogger();
		const tracer = createMockTracer();

		createApp({ logger, tracer });

		expect(createTracerMiddlewareMock).toHaveBeenCalledTimes(1);
		expect(createTracerMiddlewareMock).toHaveBeenCalledWith(tracer);

		expect(createLoggerMiddlewareMock).toHaveBeenCalledTimes(1);
		expect(createLoggerMiddlewareMock).toHaveBeenCalledWith(logger);
	});

	it("registers authentication middleware for /me route", async () => {
		const logger = createMockLogger();
		const tracer = createMockTracer();

		const app = createApp({ logger, tracer });

		const res = await app.request("/me");

		expect(authenticationMiddlewareMock).toHaveBeenCalledTimes(1);
		expect(res.status).toBe(200);
	});

	it("returns empty permissions and roles when missing", async () => {
		authenticationMiddlewareMock.mockImplementationOnce(() => {
			const middleware: MiddlewareHandler = async (c, next) => {
				c.set("auth", {
					sub: "user_456",
					email: "minimal@example.com",
					org_code: "org_min",
					iss: "https://issuer.example.com",
					aud: "api://app",
					exp: 9_999_999_999,
					iat: 1_111_111_111,
				});
				await next();
			};
			return middleware;
		});

		const logger = createMockLogger();
		const tracer = createMockTracer();

		const app = createApp({ logger, tracer });

		const res = await app.request("/me");

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			userId: "user_456",
			email: "minimal@example.com",
			orgCode: "org_min",
			permissions: [],
			roles: [],
		});
	});
});
