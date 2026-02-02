import { Polar } from "@polar-sh/sdk";
import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import { keys } from "./keys";
import { getProducts } from "./products";

export const polarClient = new Polar({
	accessToken: keys.POLAR_ACCESS_TOKEN,
	server: "sandbox",
});

export async function createFreeSubscription(
	userId: string
): Promise<Subscription> {
	const products = getProducts();

	const basicPlan = products.find((p) => p.slug === "Basic");
	if (!basicPlan) {
		throw new Error("Basic plan not found");
	}

	console.log("Creating free subscription for user", userId);
	console.log("Product ID", basicPlan.productId);

	try {
		const result = await polarClient.subscriptions.create({
			productId: basicPlan.productId,
			customerId: userId,
		});
		return result;
	} catch (error) {
		console.error("Failed to create free subscription", error);
		throw error;
	}
}
