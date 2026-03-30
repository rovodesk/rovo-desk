import { Billing } from "@zero-heads-lab/billing";
import { createBillingEnv } from "@zero-heads-lab/billing/keys";
import type { Context } from "hono";

export function createBillingInstance(c: Context): Billing {
	const billingEnv = createBillingEnv({
		STRIPE_ACCESS_TOKEN: c.env.STRIPE_ACCESS_TOKEN,
		STRIPE_WEBHOOK_SECRET: c.env.STRIPE_WEBHOOK_SECRET,
	});

	const logger = c.get("LOGGER");
	const tracer = c.get("TRACER");

	return new Billing({
		env: billingEnv,
		logger,
		tracer,
	});
}
