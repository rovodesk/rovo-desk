import type { Stripe } from "stripe";
import type { UpsertSubscriptionInput } from "../../backend/api/src/infra/database/repositories/billing/subscription/subscription.types";

export type Plan = {
	name: string;
	priceId: string;
	annualDiscountPriceId?: string;
	limits: {
		organization: number;
		team: number;
		members: number;

		folders: number;
		files: number;
		funnels: number;
	};
	freeTrial?: {
		days: number;
	};
};

export const PlanNames = {
	Basic: "Basic",
	Pro: "Pro",
	Startup: "Startup",
	Enterprise: "Enterprise",
};

export interface IBilling {
	createStripeCustomer(email: string): Promise<Stripe.Customer>;
	findAvailablePlan(): Promise<Plan[]>;
	getStripeClient(): Stripe;
	verifyStripeWebhook(rawBody: string, signature: string): Stripe.Event;
	mapStripeSubscriptionToUpsertInput(input: {
		subscription: Stripe.Subscription;
		organizationId: string;
		planId: string;
	}): UpsertSubscriptionInput;
}
