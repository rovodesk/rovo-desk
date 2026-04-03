import type {
	billingIntervalEnum,
	subscriptionStatusEnum,
} from "../../../lib/schemas/billing.schema";

export type SubscriptionStatus =
	(typeof subscriptionStatusEnum.enumValues)[number];

export type BillingInterval = (typeof billingIntervalEnum.enumValues)[number];

export interface UpsertSubscriptionInput {
	organizationId: string;
	planId: string;
	status: SubscriptionStatus;
	interval?: BillingInterval | null;
	stripeCustomerId?: string | null;
	stripeSubscriptionId?: string | null;
	periodStart?: Date | null;
	periodEnd?: Date | null;
	currentPeriodEnd?: Date | null;
	cancelAtPeriodEnd?: boolean;
	cancelAt?: Date | null;
	canceledAt?: Date | null;
	endedAt?: Date | null;
	trialStart?: Date | null;
	trialEnd?: Date | null;
	seats?: number;
	unitPrice?: number | null;
	currency?: string;
	metadata?: Record<string, unknown> | null;
}
