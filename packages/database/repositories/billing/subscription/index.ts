import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { and, desc, eq, isNull, or } from "drizzle-orm";
import { subscription } from "../../../drizzle/schemas/billing.schema";
import type { UpsertSubscriptionInput } from "./subscription.types";

export class SubscriptionRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async getById(id: string) {
		return await this.tracer.withSpan("subscription.getById", async () => {
			return await this.db.query.subscription.findFirst({
				where: and(eq(subscription.id, id), isNull(subscription.deletedAt)),
				with: {
					plan: true,
				},
			});
		});
	}

	async getByOrganizationId(organizationId: string) {
		return await this.tracer.withSpan(
			"subscription.getByOrganizationId",
			async () => {
				return await this.db.query.subscription.findFirst({
					where: and(
						eq(subscription.organizationId, organizationId),
						isNull(subscription.deletedAt)
					),
					with: {
						plan: true,
					},
					orderBy: [desc(subscription.createdAt)],
				});
			}
		);
	}

	async getActiveByOrganizationId(organizationId: string) {
		return await this.tracer.withSpan(
			"subscription.getActiveByOrganizationId",
			async () => {
				return await this.db.query.subscription.findFirst({
					where: and(
						eq(subscription.organizationId, organizationId),
						isNull(subscription.deletedAt),
						or(
							eq(subscription.status, "trialing"),
							eq(subscription.status, "active"),
							eq(subscription.status, "past_due")
						)
					),
					with: {
						plan: true,
					},
					orderBy: [desc(subscription.createdAt)],
				});
			}
		);
	}

	async getByStripeSubscriptionId(stripeSubscriptionId: string) {
		return await this.tracer.withSpan(
			"subscription.getByStripeSubscriptionId",
			async () => {
				return await this.db.query.subscription.findFirst({
					where: and(
						eq(subscription.stripeSubscriptionId, stripeSubscriptionId),
						isNull(subscription.deletedAt)
					),
					with: {
						plan: true,
					},
				});
			}
		);
	}

	async getByStripeCustomerId(stripeCustomerId: string) {
		return await this.tracer.withSpan(
			"subscription.getByStripeCustomerId",
			async () => {
				return await this.db.query.subscription.findFirst({
					where: and(
						eq(subscription.stripeCustomerId, stripeCustomerId),
						isNull(subscription.deletedAt)
					),
					with: {
						plan: true,
					},
					orderBy: [desc(subscription.createdAt)],
				});
			}
		);
	}

	async upsert(input: UpsertSubscriptionInput) {
		if (input.stripeSubscriptionId) {
			const existing = await this.getByStripeSubscriptionId(
				input.stripeSubscriptionId
			);

			if (existing) {
				await this.db
					.update(subscription)
					.set({
						organizationId: input.organizationId,
						planId: input.planId,
						status: input.status,
						interval: input.interval ?? null,
						stripeCustomerId: input.stripeCustomerId ?? null,
						periodStart: input.periodStart ?? null,
						periodEnd: input.periodEnd ?? null,
						currentPeriodEnd: input.currentPeriodEnd ?? null,
						cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? false,
						cancelAt: input.cancelAt ?? null,
						canceledAt: input.canceledAt ?? null,
						endedAt: input.endedAt ?? null,
						trialStart: input.trialStart ?? null,
						trialEnd: input.trialEnd ?? null,
						seats: input.seats ?? 1,
						unitPrice: input.unitPrice ?? null,
						currency: input.currency ?? "inr",
						metadata: input.metadata ?? {},
						updatedAt: new Date(),
						deletedAt: null,
					})
					.where(eq(subscription.id, existing.id))
					.returning();
			}
		}

		await this.db.insert(subscription).values({
			organizationId: input.organizationId,
			planId: input.planId,
			status: input.status,
			interval: input.interval ?? null,
			stripeCustomerId: input.stripeCustomerId ?? null,
			stripeSubscriptionId: input.stripeSubscriptionId ?? null,
			periodStart: input.periodStart ?? null,
			periodEnd: input.periodEnd ?? null,
			currentPeriodEnd: input.currentPeriodEnd ?? null,
			cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? false,
			cancelAt: input.cancelAt ?? null,
			canceledAt: input.canceledAt ?? null,
			endedAt: input.endedAt ?? null,
			trialStart: input.trialStart ?? null,
			trialEnd: input.trialEnd ?? null,
			seats: input.seats ?? 1,
			unitPrice: input.unitPrice ?? null,
			currency: input.currency ?? "inr",
			metadata: input.metadata ?? {},
		});
	}

	async markCanceledByStripeSubscriptionId(
		stripeSubscriptionId: string,
		input?: {
			cancelAtPeriodEnd?: boolean;
			cancelAt?: Date | null;
			canceledAt?: Date | null;
			endedAt?: Date | null;
		}
	) {
		const [updated] = await this.db
			.update(subscription)
			.set({
				status: "canceled",
				cancelAtPeriodEnd: input?.cancelAtPeriodEnd ?? false,
				cancelAt: input?.cancelAt ?? null,
				canceledAt: input?.canceledAt ?? new Date(),
				endedAt: input?.endedAt ?? null,
				updatedAt: new Date(),
			})
			.where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId))
			.returning();

		return updated;
	}

	async markUnpaidByStripeSubscriptionId(stripeSubscriptionId: string) {
		const [updated] = await this.db
			.update(subscription)
			.set({
				status: "unpaid",
				updatedAt: new Date(),
			})
			.where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId))
			.returning();

		return updated;
	}

	async softDeleteById(id: string) {
		const [deleted] = await this.db
			.update(subscription)
			.set({
				deletedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(subscription.id, id))
			.returning();

		return deleted;
	}

	async getEntitlementSnapshot(organizationId: string) {
		const activeSub = await this.getActiveByOrganizationId(organizationId);

		if (!activeSub) return null;

		return {
			subscriptionId: activeSub.id,
			organizationId: activeSub.organizationId,
			status: activeSub.status,
			planId: activeSub.planId,
			planName: activeSub.plan?.name ?? null,
			interval: activeSub.interval,
			seats: activeSub.seats,
			currentPeriodEnd: activeSub.currentPeriodEnd,
			limits: activeSub.plan?.metadata ?? {},
		};
	}
}
