import { oc } from "@orpc/contract";
import { z } from "zod";

export const healthCheck = oc
	.route({
		method: "GET",
		path: "/health",
	})
	.output(
		z.object({
			status: z.string(),
		})
	);

export const HealthContract = {
	healthCheck,
};
