import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { PlanMutationRepository } from "./plan.mutation";
import { PlanQueryRepository } from "./plan.query";

export class PlanRepository {
	readonly mutation: PlanMutationRepository;
	readonly query: PlanQueryRepository;

	constructor(db: Database, tracer: ITracer) {
		this.mutation = new PlanMutationRepository(db, tracer);
		this.query = new PlanQueryRepository(db, tracer);
	}
}
