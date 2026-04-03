import type { usageEventTypeEnum } from "../../../lib/schemas/billing.schema";

export type UsageEventType = (typeof usageEventTypeEnum.enumValues)[number];

export interface CreateUsageEventInput {
	organizationId: string;
	subscriptionId?: string | null;
	type: UsageEventType;
	quantity: number;
	cost: string;
	referenceId?: string | null;
	metadata?: Record<string, unknown> | null;
}

export interface UsageAggregateResult {
	type: UsageEventType;
	totalQuantity: number;
	totalCost: string;
}
