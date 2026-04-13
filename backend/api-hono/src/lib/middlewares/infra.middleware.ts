import { createDatabase } from "@zero-heads-lab/database";
import { QueueService } from "@zero-heads-lab/queue";
import type { MiddlewareHandler } from "hono";
import { createBillingInstance } from "@/modules/billing/create-billing";
import { createAuthInstance } from "../../modules/auth/auth-instance";
import type { AppEnv } from "../context";
import { resolveSecret } from "../utils";

export const infraMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
	const LOGGER = c.get("LOGGER");
	const TRACER = c.get("TRACER");

	const dbUrl = await resolveSecret(c.env.DATABASE_URL);
	if (!dbUrl) {
		throw new Error("DATABASE_URL is required");
	}
	const { db } = await createDatabase(dbUrl, LOGGER);
	c.set("DATABASE", db);

	const emailQueue = new QueueService(c.env.EMAIL_QUEUE, TRACER);
	c.set("EMAIL_QUEUE", emailQueue);

	const stripeEventsQueue = new QueueService(c.env.STRIPE_EVENTS_QUEUE, TRACER);
	c.set("STRIPE_EVENTS_QUEUE", stripeEventsQueue);

	// Queue and Database are required for Auth Instance
	const auth = await createAuthInstance(c);
	c.set("AUTH", auth);

	// Billing
	const billing = await createBillingInstance(c);
	c.set("BILLING", billing);

	await next();
};
