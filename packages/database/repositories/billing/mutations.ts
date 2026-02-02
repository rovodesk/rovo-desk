import type { Subscription } from "@zero-heads-lab/billing/types";
import { createDatabase } from "../../conn";
import {
	subscriptionCancellations,
	subscriptionPeriods,
	subscriptionPricing,
	subscriptions,
} from "../../drizzle/schemas/billing.schema";

export async function createSubscriptionFromPolar({
	userId,
	organizationId,
	payload,
}: {
	userId: string;
	organizationId: string;
	payload: Subscription;
}) {
	const db = createDatabase();

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Need this its unavoidable
	return await db.transaction(async (tx) => {
		/**
		 * 1️⃣ Upsert core subscription identity
		 * This replaces the insert-then-select logic with a single atomic operation.
		 */
		const [subscription] = await tx
			.insert(subscriptions)
			.values({
				userId,
				organizationId,
				polarSubscriptionId: payload.id,
				polarCustomerId: payload.customerId,
				polarProductId: payload.productId,
				status: payload.status,
				seats: payload.seats,
				metadata: payload.metadata,
				createdAt: new Date(payload.createdAt),
				modifiedAt: payload.modifiedAt
					? new Date(payload.modifiedAt)
					: new Date(),
			})
			.onConflictDoUpdate({
				target: subscriptions.polarSubscriptionId,
				set: {
					status: payload.status,
					seats: payload.seats,
					modifiedAt: new Date(),
				},
			})
			.returning({ id: subscriptions.id });

		if (!subscription) {
			tx.rollback();
			throw new Error("Failed to upsert subscription");
		}

		const subscriptionId = subscription.id;

		/**
		 * 2️⃣ Sync Period Data
		 * We use upsert here too so the "current" period is always up to date.
		 */
		await tx
			.insert(subscriptionPeriods)
			.values({
				subscriptionId,
				currentPeriodStart: payload.currentPeriodStart
					? new Date(payload.currentPeriodStart)
					: null,
				currentPeriodEnd: payload.currentPeriodEnd
					? new Date(payload.currentPeriodEnd)
					: null,
				trialStart: payload.trialStart ? new Date(payload.trialStart) : null,
				trialEnd: payload.trialEnd ? new Date(payload.trialEnd) : null,
				startedAt: payload.startedAt ? new Date(payload.startedAt) : null,
				endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
				endedAt: payload.endedAt ? new Date(payload.endedAt) : null,
				cancelAtPeriodEnd: payload.cancelAtPeriodEnd ?? false,
				createdAt: new Date(payload.createdAt),
			})
			.onConflictDoUpdate({
				target: subscriptionPeriods.subscriptionId,
				set: {
					currentPeriodStart: payload.currentPeriodStart
						? new Date(payload.currentPeriodStart)
						: null,
					currentPeriodEnd: payload.currentPeriodEnd
						? new Date(payload.currentPeriodEnd)
						: null,
					endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
					endedAt: payload.endedAt ? new Date(payload.endedAt) : null,
					cancelAtPeriodEnd: payload.cancelAtPeriodEnd ?? false,
				},
			});

		/**
		 * 3️⃣ Sync Pricing Snapshot
		 */
		await tx
			.insert(subscriptionPricing)
			.values({
				subscriptionId,
				amount: payload.amount,
				currency: payload.currency,
				interval: payload.recurringInterval,
				intervalCount: payload.recurringIntervalCount,
				polarCheckoutId: payload.checkoutId ?? null,
				polarDiscountId: payload.discountId ?? null,
				createdAt: new Date(payload.createdAt),
			})
			.onConflictDoUpdate({
				target: subscriptionPricing.subscriptionId,
				set: {
					amount: payload.amount,
					polarDiscountId: payload.discountId ?? null,
				},
			});

		/**
		 * 4️⃣ Handle Cancellation (Audit Log)
		 * Only insert if there's a cancellation date present.
		 */
		if (payload.canceledAt) {
			await tx
				.insert(subscriptionCancellations)
				.values({
					subscriptionId,
					canceledAt: new Date(payload.canceledAt),
					reason: payload.customerCancellationReason ?? null,
					comment: payload.customerCancellationComment ?? null,
				})
				.onConflictDoNothing(); // Prevent duplicate logs for the same cancellation event
		}

		return { subscriptionId };
	});
}
