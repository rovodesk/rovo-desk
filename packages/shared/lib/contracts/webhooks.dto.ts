import z from "zod";

export const WEBHOOKS_DTO = z.object({
	id: z.string(),
	event: z.string(),
	data: z.record(z.string(), z.any()),
	metadata: z.record(z.string(), z.any()),
	timestamp: z.coerce.date(),
});
