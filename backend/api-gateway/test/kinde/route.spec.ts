import type { Context } from "hono";
import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import { createKindeRoute } from "../../src/providers/kinde/route";
import type { WebhookServiceEnv } from "../../src/types";

describe("kindeRoute", () => {
	it("should dispatch webhook with trace/span/request context", async () => {
		const mockDecodedWebhook = {
			type: "user.created",
			event_id: "evt_123",
			timestamp: new Date().toISOString(),
			data: {
				user: {
					id: "user_123",
					email: "test@example.com",
				},
			},
		};

		const mockSpan = {
			name: "span-456",
			traceId: "trace-123",
			spanId: "span-456",
		};

		const dispatchSpy = vi.fn(
			(_event: unknown, c: Context<WebhookServiceEnv>) => {
				const span = c.get("span");
				const traceId = c.get("traceId");
				const requestId = c.get("requestId");
				const logger = c.env.logger;

				expect(span).toBeDefined();
				expect(traceId).toBe("trace-123");

				expect(requestId).toBe("req-789");
				expect(logger).toBeDefined();
			}
		);

		const decodeSpy = vi.fn().mockResolvedValue(mockDecodedWebhook);

		const route = createKindeRoute({
			decode: decodeSpy,
			dispatch: dispatchSpy,
		});

		const app = new Hono<WebhookServiceEnv>();

		// Inject request-scoped variables via middleware
		app.use("*", async (c, next) => {
			c.set("requestId", "req-789");
			c.env.logger = {
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
				debug: vi.fn(),
			} as never;

			await next();
		});

		app.route("/", route);

		const res = await app.request(
			"/kinde",
			{
				method: "POST",
				body: JSON.stringify({ hello: "world" }),
			},
			{
				KINDE_ISSUER_URL: "https://example.kinde.com",
				tracer: {
					withSpan: async (
						_name: string,
						fn: (span: typeof mockSpan) => Promise<void>
					) => {
						return await fn(mockSpan);
					},
				},
			} as never
		);

		expect(res.status).toBe(202);

		const json = await res.json();
		expect(json).toEqual({
			success: true,
			message: "Webhook accepted",
		});

		expect(decodeSpy).toHaveBeenCalledOnce();
		expect(dispatchSpy).toHaveBeenCalledOnce();
	});
});
