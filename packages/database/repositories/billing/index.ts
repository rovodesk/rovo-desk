import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { PlanRepository } from "./plan";
import { SubscriptionRepository } from "./subscription";
import { UsageRepository } from "./usage";
import { WebhookEventRepository } from "./webhook";

export class BillingRepository {
	readonly plan: PlanRepository;
	readonly subscription: SubscriptionRepository;
	readonly usage: UsageRepository;
	readonly webhook: WebhookEventRepository;

	readonly db: Database;
	readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
		this.plan = new PlanRepository(db, tracer);
		this.subscription = new SubscriptionRepository(db, tracer);
		this.usage = new UsageRepository(db, tracer);
		this.webhook = new WebhookEventRepository(db, tracer);
	}
}
