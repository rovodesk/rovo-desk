import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { plan } from "../../../lib/schemas/billing.schema";
import type { IPlanMutationRepository, UpsertPlanInput } from "./plan.types";

export class PlanMutationRepository implements IPlanMutationRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async upsertPlan(params: UpsertPlanInput) {
		return await this.tracer.withSpan("plan.mutation.upsertById", async () => {
			await this.db
				.insert(plan)
				.values({
					id: params.id,
					name: params.name,
					isFree: params.isFree ?? false,
					isActive: params.isActive ?? true,
					stripeProductId: params.stripeProductId ?? null,
					stripeMonthlyPriceId: params.stripeMonthlyPriceId ?? null,
					stripeAnnualPriceId: params.stripeAnnualPriceId ?? null,
					monthlyPrice: params.monthlyPrice ?? null,
					annualPrice: params.annualPrice ?? null,
					currency: params.currency ?? "inr",
					metadata: params.metadata ?? {},
				})
				.onConflictDoUpdate({
					target: plan.id,
					set: {
						name: params.name,
						isFree: params.isFree ?? false,
						isActive: params.isActive ?? true,
						stripeProductId: params.stripeProductId ?? null,
						stripeMonthlyPriceId: params.stripeMonthlyPriceId ?? null,
						stripeAnnualPriceId: params.stripeAnnualPriceId ?? null,
						monthlyPrice: params.monthlyPrice ?? null,
						annualPrice: params.annualPrice ?? null,
						currency: params.currency ?? "inr",
						metadata: params.metadata ?? {},
						updatedAt: new Date(),
					},
				});
		});
	}
}
