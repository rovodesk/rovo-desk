import { Hono } from "hono";
import type { AppEnv } from "@/lib/context";

export const authDocsRouter = new Hono<AppEnv>();

authDocsRouter.get("/auth/open-api", async (c) => {
	const auth = c.get("AUTH");

	//@ts-expect-error generateOpenAPISchema exists at runtime
	const openAPISchema = await auth.api.generateOpenAPISchema();

	return c.json(openAPISchema);
});
