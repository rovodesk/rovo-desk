import z from "zod";

export enum StripeBillingEvent {
	checkoutSessionCompleted = "checkout.session.completed",
	customerSubscriptionDeleted = "customer.subscription.deleted",
	customerSubscriptionUpdated = "customer.subscription.updated",
	customerSubscriptionCreated = "customer.subscription.created",
}

export const STRIPE_EVENT = z.object({
	id: z.string(),
	type: z.enum(StripeBillingEvent),
	source: z.literal("stripe"),
	payload: z.record(z.string(), z.unknown()),
	metadata: z.record(z.string(), z.string()).default({}),
	timestamp: z.string(),
});

export type StripeEvent = z.infer<typeof STRIPE_EVENT>;
