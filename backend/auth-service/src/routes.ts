import type { JwtPayload } from "@zero-heads-lab/auth";
import {
	authenticationMiddleware,
	createLoggerMiddleware,
	createTracerMiddleware,
} from "@zero-heads-lab/global/middlewares";
import type { ILogger, ITracer } from "@zero-heads-lab/observability";
import { Hono } from "hono";
import type { AppContext } from "./types";

type CreateAppOptions = {
	logger: ILogger;
	tracer: ITracer;
};

export function createApp({ logger, tracer }: CreateAppOptions) {
	const app = new Hono<AppContext>();

	// tracer first, logger second
	app.use("*", createTracerMiddleware(tracer));
	app.use("*", createLoggerMiddleware(logger));

	app.get("/", (c) => {
		return c.text("Hello Hono!");
	});

	app.get("/me", authenticationMiddleware(), (c) => {
		const auth: JwtPayload = c.get("auth");

		const orgCode = auth.org_code;
		c.set("orgCode", orgCode);

		return c.json({
			userId: auth.sub,
			email: auth.email,
			orgCode: auth.org_code,
			permissions: auth.permissions ?? [],
			roles: auth.roles ?? [],
		});
	});

	return app;
}
