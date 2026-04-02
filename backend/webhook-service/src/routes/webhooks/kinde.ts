import {
	handleRouteError,
	handleRouteSuccess,
	requireBearerToken,
	validateRequestBody,
} from "@zero-heads-lab/global/utils";
import cuid from "cuid";
import { Hono } from "hono";

import { normalizeKindeWebhook } from "@/providers/kinde/normalise";
import { verifyKindeWebhook } from "@/providers/kinde/verify";
import { createWebhookService } from "@/service";
import type { WebhookServiceEnv } from "@/types";
import { createDeterministicWebhookKey } from "@/utils/create-deterministic-webhook-key";

export function createKindeRoute() {
	const kindeRoute = new Hono<WebhookServiceEnv>();

	kindeRoute.post("/kinde", async (c) => {
		try {
			// ✅ parse + validate body
			const body = await validateRequestBody(c.req.raw, {
				expected: "json",
			});

			// ✅ auth
			const token = requireBearerToken(c.req.raw);

			// ✅ verify
			const decodedWebhook = await verifyKindeWebhook(
				token,
				c.env.KINDE_ISSUER_URL
			);
			if (!decodedWebhook) {
				return handleRouteError(c, new Error("Invalid webhook payload"), 400);
			}

			// Deterministic idempotency key
			// FIXME: USe Webhook_id as idempotency key
			const providerEventId =
				typeof decodedWebhook.event_id === "string" &&
				decodedWebhook.event_id.length > 0
					? decodedWebhook.event_id
					: await createDeterministicWebhookKey(body.raw);

			// ✅ normalize
			const event = normalizeKindeWebhook({
				rawBody: decodedWebhook as Record<string, unknown>,
				providerEventId,
				idempotencyKey: providerEventId,
				requestId: c.req.header("cf-ray") ?? cuid(),
				traceId: providerEventId, // simple but effective
			});

			// ✅ enqueue
			const service = createWebhookService(c);
			await service.ingest(event);

			return handleRouteSuccess(c, "Webhook accepted", 202);
		} catch (error) {
			return handleRouteError(c, error, 500);
		}
	});

	return kindeRoute;
}

export const kindeRoute = createKindeRoute();
