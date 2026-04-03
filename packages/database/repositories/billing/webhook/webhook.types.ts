import type { InferSelectModel } from "drizzle-orm";
import type {
	stripeWebhookEvent,
	usageEventTypeEnum,
	webhookEventStatusEnum,
} from "../../../lib/schemas/billing.schema";

export type UsageEventType = (typeof usageEventTypeEnum.enumValues)[number];

export type WebhookEventStatus =
	(typeof webhookEventStatusEnum.enumValues)[number];

export type WebhookEvent = InferSelectModel<typeof stripeWebhookEvent>;

export type PlanMetadata = Record<string, unknown>;
export type SubscriptionMetadata = Record<string, unknown>;
export type UsageMetadata = Record<string, unknown>;
export type StripeWebhookPayload = Record<string, unknown>;

export interface CurrentUsageWindow {
	start: Date;
	end: Date;
}

export interface CreateWebhookEventInput {
	id: string;
	type: string;
	apiVersion?: string | null;
	account?: string | null;
	objectId?: string | null;
	payload: Record<string, unknown>;
}

export interface IWebhookEventRepository {
	createIfNotExists(input: CreateWebhookEventInput): Promise<void>;
	getById(params: { id: string }): Promise<WebhookEvent | null>;
	markProcessing(params: { id: string }): Promise<void>;
	markProcessed(params: { id: string }): Promise<void>;
	markFailed(params: { id: string }, error: string): Promise<void>;
	incrementAttempt(params: { id: string }): Promise<void>;
}
