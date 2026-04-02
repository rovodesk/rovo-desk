import type { STRIPE_WEBHOOK_MESSAGE_EVENT } from "@zero-heads-lab/contract/lib/event/stripe";
import type { AppEnv } from "@/lib/context";
import { BillingConsumer } from "@/modules/billing/stripe.consumer";
import { createApp } from "./app";

const app = createApp();

export default {
	// biome-ignore lint/suspicious/useAwait: No await needed
	async fetch(request: Request, env: AppEnv, ctx: ExecutionContext) {
		// Hono automatically handles passing env and ctx to your middlewares
		return app.fetch(request, env, ctx);
	},

	// Billing Consumer
	async queue(
		batch: MessageBatch<STRIPE_WEBHOOK_MESSAGE_EVENT>,
		env: AppEnv,
		ctx: ExecutionContext
	) {
		await BillingConsumer(batch, env.Bindings, ctx);
	},
};
