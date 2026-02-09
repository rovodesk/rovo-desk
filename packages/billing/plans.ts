import { keys } from "./keys";

export type Plan = {
	name: string;
	priceId: string;
	annualDiscountPriceId?: string;
	limits: {
		organization: number;
		team: number;
		members: number;

		folders: number;
		files: number;
		funnels: number;
	};
	freeTrial?: {
		days: number;
	};
};

export const PlanNames = {
	Basic: "Basic",
	Pro: "Pro",
	Startup: "Startup",
	Enterprise: "Enterprise",
};

export const UserPlans: Plan[] = [
	{
		name: PlanNames.Pro,
		priceId: keys.PRO_PLAN_MONTHLY_PRICE_ID,
		annualDiscountPriceId: keys.PRO_PLAN_ANNUAL_PRICE_ID,
		limits: {
			organization: 1,
			team: 3,
			members: 20,
			folders: 10,
			files: 100,
			funnels: 10,
		},
		freeTrial: {
			days: 30,
		},
	},
	{
		name: PlanNames.Startup,
		priceId: keys.STARTUP_PLAN_MONTHLY_PRICE_ID,
		annualDiscountPriceId: keys.STARTUP_PLAN_ANNUAL_PRICE_ID,
		limits: {
			organization: 10,
			team: 10,
			members: 100,
			folders: 100_000_000, // Unlimited
			files: 100_000_000, // Unlimited
			funnels: 100_000_000, // Unlimited
		},
	},
];
