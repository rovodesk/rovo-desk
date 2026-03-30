import { WebhookEventRepository } from "@zero-heads-lab/database/repositories/billing/webhook";
import { Hono } from "hono";
import type { Bindings, Variables } from "@/types";

export const stripeWebhookRouter = new Hono<{
	Variables: Variables;
	Bindings: Bindings;
}>();

stripeWebhookRouter.post("/", async (c) => {
	const db = c.get("DATABASE");
	const tracer = c.get("TRACER");
	const billing = c.get("BILLING");
	const queue = c.get("STRIPE_EVENTS_QUEUE");

	const signature = c.req.header("stripe-signature");
	if (!signature) {
		return c.json({ error: "Missing Stripe-Signature header" }, 400);
	}

	const rawBody = await c.req.text();

	// biome-ignore lint/suspicious/noExplicitAny: An Event Can be of any type
	let event: any;
	try {
		event = billing.verifyStripeWebhook(rawBody, signature);
	} catch (error) {
		console.error("Stripe signature verification failed:", error);
		return c.json({ error: "Invalid signature" }, 400);
	}

	const objectId =
		typeof event.data?.object === "object" && event.data.object
			? "id" in event.data.object
				? String(event.data.object.id)
				: null
			: null;

	// idempotent ingress guard
	const repo = new WebhookEventRepository(db, tracer);

	Promise.all([
		repo.createIfNotExists({
			id: event.id,
			type: event.type,
			apiVersion: event.api_version ?? null,
			account: event.account ?? null,
			objectId,
			payload: event as unknown as Record<string, unknown>,
		}),
		queue.enqueue({
			eventId: event.id,
			type: event.type,
			receivedAt: new Date().toISOString(),
		}),
	]);

	return c.json({ received: true }, 200);
});
