import type { InferInsertModel } from "drizzle-orm";
import type { Database } from "../conn";
import { plan } from "../schemas/billing.schema";

const planData: InferInsertModel<typeof plan>[] = [
	{
		id: "free",
		name: "Free",
		isFree: true,
		isActive: true,

		stripeProductId: null,
		stripeMonthlyPriceId: null,
		stripeAnnualPriceId: null,

		monthlyPrice: 0,
		annualPrice: 0,
		currency: "inr",

		metadata: {
			maxProjects: 1,
			maxMembers: 1,
			aiCredits: 1000,
			prioritySupport: false,
		},
	},
	{
		id: "pro",
		name: "Pro",
		isFree: false,
		isActive: true,

		// replace with real Stripe IDs
		stripeProductId: "prod_xxx",
		stripeMonthlyPriceId: "price_xxx_monthly",
		stripeAnnualPriceId: "price_xxx_annual",

		monthlyPrice: 999,
		annualPrice: 9999,
		currency: "inr",

		metadata: {
			maxProjects: 10,
			maxMembers: 5,
			aiCredits: 100_000,
			prioritySupport: true,
		},
	},
	{
		id: "team",
		name: "Team",
		isFree: false,
		isActive: true,

		// replace with real Stripe IDs
		stripeProductId: "prod_yyy",
		stripeMonthlyPriceId: "price_yyy_monthly",
		stripeAnnualPriceId: "price_yyy_annual",

		monthlyPrice: 2999,
		annualPrice: 29_999,
		currency: "inr",

		metadata: {
			maxProjects: 100,
			maxMembers: 25,
			aiCredits: 1_000_000,
			prioritySupport: true,
		},
	},
];

export async function seedPlans(db: Database) {
	for (const planRow of planData) {
		await db
			.insert(plan)
			.values(planRow)
			.onConflictDoUpdate({
				target: plan.id,
				set: {
					name: planRow.name,
					isFree: planRow.isFree,
					isActive: planRow.isActive,

					stripeProductId: planRow.stripeProductId,
					stripeMonthlyPriceId: planRow.stripeMonthlyPriceId,
					stripeAnnualPriceId: planRow.stripeAnnualPriceId,

					monthlyPrice: planRow.monthlyPrice,
					annualPrice: planRow.annualPrice,
					currency: planRow.currency,

					metadata: planRow.metadata,
					updatedAt: new Date(),
				},
			});
	}
}
