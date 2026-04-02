import {
	createLoggerMiddleware,
	createTracerMiddleware,
} from "@zero-heads-lab/global/middlewares";
import type { ILogger, ITracer } from "@zero-heads-lab/observability";
import { Hono } from "hono";
import { kindeRoute } from "@/routes/webhooks/kinde";
import type { WebhookServiceEnv } from "@/types";

type CreateAppOptions = {
	logger: ILogger;
	tracer: ITracer;
};

export function createApp({ logger, tracer }: CreateAppOptions) {
	const app = new Hono<WebhookServiceEnv>();

	// tracer first, logger second
	app.use("*", createTracerMiddleware(tracer));
	app.use("*", createLoggerMiddleware(logger));

	app.get("/health", (c) => {
		return c.json({ ok: true, service: "webhook-service" });
	});

	app.route("/webhooks", kindeRoute);

	return app;
}
