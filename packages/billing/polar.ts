import { Polar } from "@polar-sh/sdk";
import type { CustomerWithMembers } from "@polar-sh/sdk/models/components/customerwithmembers.js";
import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import { keys } from "./keys";
import { getProducts } from "./products";

export const polarClient = new Polar({
	accessToken: keys.POLAR_ACCESS_TOKEN,
	server: "sandbox",
});

export async function createFreeSubscription(
	userId: string,
	name: string,
	email: string,
	emailVerified: boolean,
	orgId: string,
	orgName: string,
	orgSlug: string,
	teamId: string,
	teamName: string
): Promise<Subscription> {
	const products = getProducts();

	const basicPlan = products.find((p) => p.slug === "Basic");
	if (!basicPlan) {
		throw new Error("Basic plan not found");
	}

	// 1. Get or create customer (idempotent & concurrency-safe)
	let customer: CustomerWithMembers;

	try {
		customer = await polarClient.customers.getExternal({
			externalId: userId,
		});
	} catch {
		try {
			customer = await polarClient.customers.create({
				name,
				email,
				externalId: userId,
				type: "individual",
				metadata: {
					emailVerified: emailVerified.toString(),
					orgId,
					orgName,
					orgSlug,
					teamId,
					teamName,
				},
			});
		} catch {
			// Handles race condition where another request created it first
			customer = await polarClient.customers.getExternal({
				externalId: userId,
			});
		}
	}

	// 2. Ensure metadata stays in sync
	await polarClient.customers.update({
		id: customer.id,
		customerUpdate: {
			name,
			email,
			metadata: {
				emailVerified,
				orgId,
				orgName,
				orgSlug,
				teamId,
				teamName,
			},
		},
	});

	// 3. Check for existing active Basic subscription
	const subscriptions = await polarClient.subscriptions.list({
		customerId: customer.id,
	});

	const existingBasicSubscription = subscriptions.result.items.find(
		(sub) => sub.productId === basicPlan.productId && sub.status === "active"
	);

	if (existingBasicSubscription) {
		return existingBasicSubscription;
	}

	// 4. Create subscription (idempotent-safe)
	return await polarClient.subscriptions.create({
		productId: basicPlan.productId,
		customerId: customer.id,
	});
}

export async function deleteCustomer(userId: string) {
	await polarClient.customers.deleteExternal({
		externalId: userId,
		anonymize: true,
	});
}
