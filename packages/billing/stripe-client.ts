import Stripe from "stripe";

export const STRIPE_API_VERSION = "2026-02-25.clover";

export const getStripeClient = (accessToken: string): Stripe => {
	return new Stripe(accessToken, {
		apiVersion: STRIPE_API_VERSION,
	});
};
