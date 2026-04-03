import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { eq, or } from "drizzle-orm";
import { plan } from "../../../lib/schemas/billing.schema";
import type { IPlanQueryRepository, Plan } from "./plan.types";

export class PlanQueryRepository implements IPlanQueryRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async getAllActive(): Promise<Plan[]> {
		return await this.tracer.withSpan("plan.getAllActive", async () => {
			return await this.db.query.plan.findMany({
				where: eq(plan.isActive, true),
				orderBy: (t, { asc }) => [asc(t.monthlyPrice)],
			});
		});
	}

	async getById(params: { id: string }): Promise<Plan | null> {
		return await this.tracer.withSpan("plan.getById", async () => {
			const p = await this.db.query.plan.findFirst({
				where: eq(plan.id, params.id),
			});
			return p ?? null;
		});
	}
	async getByName(params: { name: string }): Promise<Plan | null> {
		return await this.tracer.withSpan("plan.getByName", async () => {
			const p = await this.db.query.plan.findFirst({
				where: eq(plan.name, params.name),
			});
			return p ?? null;
		});
	}

	async getByStripeProductId(params: {
		stripeProductId: string;
	}): Promise<Plan | null> {
		return await this.tracer.withSpan("plan.getByStripeProductId", async () => {
			const p = await this.db.query.plan.findFirst({
				where: eq(plan.stripeProductId, params.stripeProductId),
			});
			return p ?? null;
		});
	}

	async getByStripePriceId(params: {
		stripePriceId: string;
	}): Promise<Plan | null> {
		return await this.tracer.withSpan("plan.getByStripePriceId", async () => {
			const p = await this.db.query.plan.findFirst({
				where: or(
					eq(plan.stripeMonthlyPriceId, params.stripePriceId),
					eq(plan.stripeAnnualPriceId, params.stripePriceId)
				),
			});
			return p ?? null;
		});
	}
}
