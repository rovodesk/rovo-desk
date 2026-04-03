import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { plan } from "../../../lib/schemas/billing.schema";

export type Plan = InferSelectModel<typeof plan>;

export interface IPlanQueryRepository {
	getAllActive(): Promise<Plan[]>;
	getById(params: { id: string }): Promise<Plan | null>;
	getByName(params: { name: string }): Promise<Plan | null>;
	getByStripeProductId(params: {
		stripeProductId: string;
	}): Promise<Plan | null>;
	getByStripePriceId(params: { stripePriceId: string }): Promise<Plan | null>;
}

export type UpsertPlanInput = Pick<
	InferInsertModel<typeof plan>,
	| "id"
	| "name"
	| "isFree"
	| "isActive"
	| "stripeProductId"
	| "stripeMonthlyPriceId"
	| "stripeAnnualPriceId"
	| "monthlyPrice"
	| "annualPrice"
	| "currency"
	| "metadata"
>;

export interface IPlanMutationRepository {
	upsertPlan(input: UpsertPlanInput): Promise<void>;
}

export interface IPlanRepository {
	readonly query: IPlanQueryRepository;
	readonly mutation: IPlanMutationRepository;
}
