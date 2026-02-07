import Stripe from "stripe";
import { keys } from "./keys";

export const stripeClient = new Stripe(keys.STRIPE_ACCESS_TOKEN, {
	apiVersion: "2026-01-28.clover",
});
