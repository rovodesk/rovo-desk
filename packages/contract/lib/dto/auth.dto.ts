import { z } from "zod";

export const ORGANIZATION = z.object({
	slug: z.string(),
	name: z.string(),
	createdAt: z.date(),
	id: z.string(),
	logo: z.string().nullable(),
	metadata: z.unknown(),
	stripeCustomerId: z.string().nullable(),
	updatedAt: z.date().nullable(),
	deletedAt: z.date().nullable(),
});
