import { Scalar } from "@scalar/hono-api-reference";
import type { ICacheStore } from "@zero-heads-lab/cache";
import type { Database } from "@zero-heads-lab/database";
import { resolveStatusCode } from "@zero-heads-lab/global/errors";
import {
	createLoggerMiddleware,
	createTracerMiddleware,
} from "@zero-heads-lab/global/middlewares";
import {
	getTraceContext,
	type ILogger,
	type ITracer,
	SpanStatusCode,
} from "@zero-heads-lab/observability";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { UserRepository } from "@/modules/user/repository";
import { createUserRoute } from "@/modules/user/routes";
import { UserService } from "@/modules/user/service";
import type { AuthServieEnv, KindeConfig } from "../types";

type CreateAppOptions = {
	logger: ILogger;
	tracer: ITracer;
	database: Database;
	cacheStore: ICacheStore;
	kinde: KindeConfig;
};

export function createApp({
	logger,
	tracer,
	database,
	cacheStore,
	kinde,
}: CreateAppOptions) {
	if (!(logger && tracer && database && cacheStore && kinde)) {
		throw new Error("Missing required dependencies");
	}

	const app = new Hono<AuthServieEnv>();

	/**
	 * 🔹 Core Middlewares
	 */
	app.use("*", createTracerMiddleware(tracer));
	app.use("*", createLoggerMiddleware(logger));
	app.use("*", async (c, next) => {
		c.set("cacheStore", cacheStore);
		await next();
	});

	/**
	 * 🔹 Dependency wiring
	 */
	const userRepository = new UserRepository(database, cacheStore, tracer);

	const userService = new UserService({
		repo: userRepository,
		kinde,
		cacheStore,
		logger,
		tracer,
	});

	/**
	 * 🔹 Routes
	 */
	app.route("/internal/user", createUserRoute(userService));

	/**
	 * 🔹 OpenAPI JSON (required for Scalar)
	 */
	app.get(
		"/openapi.json",
		openAPIRouteHandler(app, {
			documentation: {
				info: {
					title: "Auth Service API",
					version: "1.0.0",
					description: "Internal Auth Service APIs",
				},
				servers: [
					{
						url: "/",
						description: "Local / Production",
					},
				],
			},
		})
	);
	app.get("/doc", Scalar({ url: "/openapi.json" }));

	/**
	 * 🔹 Global Error Handler (VERY important)
	 */
	app.onError((err, c) => {
		console.error("🔥 ON ERROR TRIGGERED:", err); // 👈 ADD THIS

		const traceCtx = getTraceContext();
		const span = c.get("span");

		const status = resolveStatusCode(err);
		const isServerError = status >= 500;

		if (span) {
			span.recordException(err instanceof Error ? err : new Error(String(err)));
			span.setStatus({
				code: SpanStatusCode.ERROR,
				message: err instanceof Error ? err.message : "Unknown Error",
			});
		}

		const errorLogger =
			logger?.withTrace?.(traceCtx.traceId, traceCtx.spanId) ?? logger;

		errorLogger.error("request.error", {
			status,
			type: err instanceof Error ? err.name : "UnknownError",
			message: err instanceof Error ? err.message : String(err),
			stack: err instanceof Error ? err.stack : undefined, // 👈 ALWAYS log stack
		});

		return c.json(
			{
				success: false,
				error: isServerError ? "Internal Server Error" : (err as Error).message,
				traceId: traceCtx.traceId,
			},
			// biome-ignore lint/suspicious/noExplicitAny: Hono's Context.json doesn't accept a number
			status as any
		);
	});

	/**
	 * 🔹 Not Found
	 */
	app.notFound((c) => {
		return c.json(
			{
				success: false,
				error: "Route Not Found",
			},
			404
		);
	});

	return app;
}
