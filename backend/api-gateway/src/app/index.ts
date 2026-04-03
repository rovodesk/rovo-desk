import {
	createLoggerMiddleware,
	createTracerMiddleware,
} from "@zero-heads-lab/global/middlewares";
import type { ILogger, ITracer } from "@zero-heads-lab/observability";
import { Hono } from "hono";
import type { ApiGatewayServiceEnv } from "@/types";

type CreateAppOptions = {
	logger: ILogger;
	tracer: ITracer;
};

export function createApp({ logger, tracer }: CreateAppOptions) {
	const app = new Hono<ApiGatewayServiceEnv>();

	// tracer first, logger second
	app.use("*", createTracerMiddleware(tracer));
	app.use("*", createLoggerMiddleware(logger));

	app.get("/health", (c) => {
		return c.json({ ok: true, service: "api-gateway" });
	});

	return app;
}
