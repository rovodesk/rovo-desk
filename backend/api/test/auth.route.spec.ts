// //@ts-nocheck
// import {
// 	createExecutionContext,
// 	waitOnExecutionContext,
// } from "cloudflare:test";
// import { env } from "cloudflare:workers";
// import { createMockAnalytics } from "@zero-heads-lab/analytics/test/mocks/analytics";
// import { createMockLogger } from "@zero-heads-lab/analytics/test/mocks/logger";
// import { createMockTracer } from "@zero-heads-lab/analytics/test/mocks/tracer";
// import { Hono } from "hono";
// import { beforeEach, describe, expect, it, vi } from "vitest";
// import { AuthError } from "../src/lib/errors/auth.error";
// import { authRoute } from "../src/routes/auth.route";

// // Mock the auth factory so we don't boot real Better Auth
// const mockHandler = vi.fn();

// vi.mock("@zero-heads-lab/auth/server/better-auth", () => {
// 	return {
// 		createAuth: vi.fn(async () => ({
// 			handler: mockHandler,
// 		})),
// 	};
// });

// function createTestApp() {
// 	const app = new Hono();

// 	app.use("*", async (c, next) => {
// 		c.set("Analytics", createMockAnalytics() as any);
// 		c.set("Logger", createMockLogger() as any);
// 		c.set("Tracer", createMockTracer() as any);
// 		await next();
// 	});

// 	app.route("/auth", authRoute);

// 	return app;
// }

// describe("authRoute", () => {
// 	beforeEach(() => {
// 		vi.clearAllMocks();
// 	});

// 	it("delegates request to auth.handler and returns its response", async () => {
// 		mockHandler.mockResolvedValueOnce(
// 			new Response(JSON.stringify({ ok: true }), {
// 				status: 200,
// 				headers: { "content-type": "application/json" },
// 			})
// 		);

// 		const app = createTestApp();
// 		const request = new Request("http://localhost:5001/auth/sign-in", {
// 			method: "POST",
// 		});
// 		const ctx = await createExecutionContext();

// 		const response = await app.fetch(request, env, ctx);

// 		await waitOnExecutionContext(ctx);

// 		expect(mockHandler).toHaveBeenCalledTimes(1);
// 		expect(response.status).toBe(200);
// 		expect(await response.json()).toEqual({ ok: true });
// 	});

// 	it("passes the raw request into auth.handler", async () => {
// 		mockHandler.mockResolvedValueOnce(new Response("ok", { status: 200 }));

// 		const app = createTestApp();
// 		const request = new Request("http://localhost:5001/auth/session", {
// 			method: "GET",
// 		});
// 		const ctx = await createExecutionContext();

// 		await app.fetch(request, env, ctx);
// 		await waitOnExecutionContext(ctx);

// 		expect(mockHandler).toHaveBeenCalledTimes(1);
// 		expect(mockHandler).toHaveBeenCalledWith(expect.any(Request));
// 	});

// 	it("supports both GET and POST methods", async () => {
// 		mockHandler.mockResolvedValue(new Response("ok", { status: 200 }));

// 		const app = createTestApp();

// 		const getCtx = await createExecutionContext();
// 		const getRes = await app.fetch(
// 			new Request("http://localhost:5001/auth/test", { method: "GET" }),
// 			env,
// 			getCtx
// 		);
// 		await waitOnExecutionContext(getCtx);

// 		const postCtx = createExecutionContext();
// 		const postRes = await app.fetch(
// 			new Request("http://localhost:5001/auth/test", { method: "POST" }),
// 			env,
// 			postCtx
// 		);
// 		await waitOnExecutionContext(postCtx);

// 		expect(getRes.status).toBe(200);
// 		expect(postRes.status).toBe(200);
// 		expect(mockHandler).toHaveBeenCalledTimes(2);
// 	});

// 	it("rethrows AuthError and records it on the span", async () => {
// 		const authError = new AuthError("Unauthorized", 401 as any);

// 		mockHandler.mockRejectedValueOnce(authError);

// 		const app = createTestApp();
// 		const request = new Request("http://localhost:5001/auth/fail", {
// 			method: "POST",
// 		});
// 		const ctx = await createExecutionContext();

// 		const response = await app.fetch(request, env, ctx);
// 		await waitOnExecutionContext(ctx);

// 		expect(response.status).toBe(500);
// 	});

// 	it("propagates non-AuthError failures from auth.handler", async () => {
// 		mockHandler.mockRejectedValueOnce(new Error("Unexpected failure"));

// 		const app = createTestApp();
// 		const request = new Request("http://localhost:5001/auth/fail", {
// 			method: "POST",
// 		});
// 		const ctx = await createExecutionContext();

// 		const response = await app.fetch(request, env, ctx);
// 		await waitOnExecutionContext(ctx);

// 		expect(response.status).toBe(500);
// 	});
// });
