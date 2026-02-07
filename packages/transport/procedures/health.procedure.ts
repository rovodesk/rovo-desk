import { os } from "@orpc/server";
import z from "zod";

export const healthProcedure = os
	.route({ method: "GET" })
	.output(
		z.object({
			status: z.string(),
		})
	)
	.handler(() => {
		console.log("PUBLIC PROCEDURE");
		return { status: "ok" };
	});
