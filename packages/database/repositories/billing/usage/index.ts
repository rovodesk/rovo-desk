import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { and, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { subscription, usageEvent } from "../../../lib/schemas/billing.schema";
import type {
	CreateUsageEventInput,
	UsageAggregateResult,
} from "./usage.types";

export class UsageRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async create(input: CreateUsageEventInput) {
		return await this.tracer.withSpan("usage.create", async () => {
			return await this.db
				.insert(usageEvent)
				.values({
					organizationId: input.organizationId,
					subscriptionId: input.subscriptionId ?? null,
					type: input.type,
					quantity: input.quantity,
					cost: input.cost,
					referenceId: input.referenceId ?? null,
					metadata: input.metadata ?? {},
				})
				.returning();
		});
	}

	async getByReferenceId(organizationId: string, referenceId: string) {
		return await this.tracer.withSpan("usage.getByReferenceId", async () => {
			return await this.db.query.usageEvent.findFirst({
				where: and(
					eq(usageEvent.organizationId, organizationId),
					eq(usageEvent.referenceId, referenceId),
					isNull(usageEvent.deletedAt)
				),
			});
		});
	}

	async listBySubscriptionId(subscriptionId: string) {
		return await this.tracer.withSpan(
			"usage.listBySubscriptionId",
			async () => {
				await this.db.query.usageEvent.findMany({
					where: and(
						eq(usageEvent.subscriptionId, subscriptionId),
						isNull(usageEvent.deletedAt)
					),
					orderBy: (t, { desc }) => [desc(t.createdAt)],
				});
			}
		);
	}

	async aggregateByDateRange(input: {
		organizationId: string;
		start: Date;
		end: Date;
	}) {
		return await this.tracer.withSpan(
			"usage.aggregateByDateRange",
			async () => {
				const rows = await this.db
					.select({
						type: usageEvent.type,
						totalQuantity: sql<number>`coalesce(sum(${usageEvent.quantity}), 0)`,
						totalCost: sql<string>`coalesce(sum(${usageEvent.cost}), 0)`,
					})
					.from(usageEvent)
					.where(
						and(
							eq(usageEvent.organizationId, input.organizationId),
							isNull(usageEvent.deletedAt),
							gte(usageEvent.createdAt, input.start),
							lte(usageEvent.createdAt, input.end)
						)
					)
					.groupBy(usageEvent.type);

				return rows as UsageAggregateResult[];
			}
		);
	}

	async aggregateCurrentCycle(organizationId: string) {
		await this.tracer.withSpan("usage.aggregateCurrentCycle", async () => {
			const currentSub = await this.db.query.subscription.findFirst({
				where: and(
					eq(subscription.organizationId, organizationId),
					isNull(subscription.deletedAt)
				),
				orderBy: (t, { desc }) => [desc(t.createdAt)],
			});

			if (!(currentSub?.periodStart && currentSub?.currentPeriodEnd)) {
				return [];
			}

			return this.aggregateByDateRange({
				organizationId,
				start: currentSub.periodStart,
				end: currentSub.currentPeriodEnd,
			});
		});
	}
}
