import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { corsMiddleware } from "@/lib/middlewares/cors.middleware";
import { infraMiddleware } from "@/lib/middlewares/infra.middleware";
import { observabilityMiddleware } from "@/lib/middlewares/obs.middleware";
import { authDocsRouter } from "@/modules/docs/auth.docs.router";
import { healthRouter } from "@/modules/health/health.route";
import type { AppEnv } from "../lib/context";
import { authRouter } from "../modules/auth/auth.router";
import { rpcRouter } from "../modules/rpc/rpc.route";

export function createApp() {
	const app = new Hono<AppEnv>();

	app.use("*", corsMiddleware);
	app.use("*", observabilityMiddleware);
	app.use("*", infraMiddleware);
	app.get(
		"/docs",
		Scalar((c) => {
			return {
				pageTitle: "API Documentation",
				//@ts-expect-error: CLOUDFLARE_ENV is not defined in the AppEnv it is from cloudflare
				url: c.env?.CLOUDFLARE_ENV !== "production" ? "/docs" : undefined,
				sources: [
					{ url: "/auth/open-api", title: "Auth" },
					{ url: "/rpc/open-api", title: "RPC" },
				],
			};
		})
	);

	app.route("/", healthRouter); // Handles /health/*
	app.route("/", authRouter); // Handles /auth/*
	app.route("/", rpcRouter); // Route Group Handles /rpc/*
	app.route("/", authDocsRouter); // Handles /auth/open-api/*

	app.notFound((c) => {
		return c.json(
			{
				success: false,
				data: null,
				error: "Route not found",
			},
			404
		);
	});

	app.onError((err, c) => {
		console.error("App Error", err);
		return c.text("Internal Server Error", 500);
	});

	return app;
}
