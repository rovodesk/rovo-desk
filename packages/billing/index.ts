import type { ILogger, ITracer } from "@zero-heads-lab/analytics/types";
import type { UpsertSubscriptionInput } from "@zero-heads-lab/database/repositories/billing/subscription/subscription.types";
import type Stripe from "stripe";
import type { BillingEnv } from "./keys";
import { getStripeClient } from "./stripe-client";
import { type IBilling, type Plan, PlanNames } from "./types";

const DemoPlans: Plan[] = [
	{
		name: PlanNames.Pro,
		priceId: "price_1S50142e79241845",
		annualDiscountPriceId: "price_1S50142e79241845",
		limits: {
			organization: 1,
			team: 3,
			members: 20,
			folders: 10,
			files: 100,
			funnels: 10,
		},
		freeTrial: {
			days: 30,
		},
	},
	{
		name: PlanNames.Startup,
		priceId: "price_1S50142e79241845",
		annualDiscountPriceId: "price_1S50142e79241845",
		limits: {
			organization: 10,
			team: 10,
			members: 100,
			folders: 100_000_000, // Unlimited
			files: 100_000_000, // Unlimited
			funnels: 100_000_000, // Unlimited
		},
	},
];

export type BillingOptions = {
	env: BillingEnv;
	logger: ILogger;
	tracer: ITracer;
	stripeClient?: Stripe;
};

export class Billing implements IBilling {
	private readonly env: BillingEnv;
	private readonly stripeClient: Stripe;
	private readonly logger: ILogger;
	private readonly tracer: ITracer;

	constructor(options: BillingOptions) {
		this.env = options.env;
		this.stripeClient =
			options.stripeClient ?? getStripeClient(options.env.STRIPE_ACCESS_TOKEN!);
		this.logger = options.logger;
		this.tracer = options.tracer;
	}

	getStripeClient() {
		if (!this.env.STRIPE_ACCESS_TOKEN) {
			throw new Error("STRIPE_ACCESS_TOKEN is not defined");
		}
		return this.stripeClient;
	}

	async createStripeCustomer(email: string): Promise<Stripe.Customer> {
		return await this.tracer.withSpan(
			"billing.createStripeCustomer",
			async () => {
				const customer = await this.stripeClient.customers.create({
					email,
				});

				return customer;
			}
		);
	}

	// biome-ignore lint/suspicious/useAwait: Not awaited
	async findAvailablePlan(): Promise<Plan[]> {
		return DemoPlans;
	}

	verifyStripeWebhook(rawBody: string, signature: string) {
		if (!this.env.STRIPE_WEBHOOK_SECRET) {
			throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
		}
		const event = this.stripeClient.webhooks.constructEvent(
			rawBody,
			signature,
			this.env.STRIPE_WEBHOOK_SECRET!
		);
		return event;
	}

	mapStripeSubscriptionToUpsertInput(input: {
		subscription: Stripe.Subscription;
		organizationId: string;
		planId: string;
	}): UpsertSubscriptionInput {
		const sub = input.subscription;
		const item = sub.items.data[0];

		return {
			organizationId: input.organizationId,
			planId: input.planId,
			status: sub.status as UpsertSubscriptionInput["status"],
			interval: item?.price?.recurring?.interval as "month" | "year" | null,
			stripeCustomerId: typeof sub.customer === "string" ? sub.customer : null,
			stripeSubscriptionId: sub.id,
			periodStart: new Date(sub.start_date * 1000),
			periodEnd: sub.ended_at ? new Date(sub.ended_at * 1000) : null,
			currentPeriodEnd: sub.ended_at ? new Date(sub.ended_at * 1000) : null,
			cancelAtPeriodEnd: sub.cancel_at_period_end,
			cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
			canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
			endedAt: sub.ended_at ? new Date(sub.ended_at * 1000) : null,
			trialStart: sub.trial_start ? new Date(sub.trial_start * 1000) : null,
			trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
			seats: item?.quantity ?? 1,
			unitPrice: item?.price?.unit_amount ?? null,
			currency: sub.currency ?? "inr",
			metadata: sub.metadata,
		};
	}
}
