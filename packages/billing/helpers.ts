import type Stripe from "stripe";
import { stripeClient } from "./stripe-clinet";

export async function createStripeCustomer(
	email: string
): Promise<Stripe.Customer> {
	const customer = await stripeClient.customers.create({
		email,
	});

	return customer;
}
