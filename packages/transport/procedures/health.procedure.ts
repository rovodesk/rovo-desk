import z from "zod";
import { base } from "../context";
import { BaseMiddleware } from "../middlewares/base.middleware";

export const healthProcedure = base
	.use(BaseMiddleware)
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
