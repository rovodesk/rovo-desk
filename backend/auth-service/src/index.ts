import { CacheStore } from "@zero-heads-lab/cache";
import { createDatabase } from "@zero-heads-lab/database";
import {
	type ILogger,
	type ITracer,
	Logger,
	type LogLevel,
	Tracer,
} from "@zero-heads-lab/observability";
import type { Hono } from "hono";

import { name, version } from "../package.json";
import { createApp } from "./app";
import type { AuthServiceBindings, AuthServieEnv } from "./types";

function createWorkerTracer(): Tracer {
	return new Tracer({
		app: name,
		version,
	});
}

function createWorkerLogger(env: AuthServiceBindings): Logger {
	return new Logger({
		level: env.WRANGLER_LOG as LogLevel,
		debug: env.WORKER_ENV !== "production",
		mode: env.WORKER_ENV === "production" ? "json" : "pretty",
		app: name,
		version,
	});
}

async function createWorkerDatabase(env: AuthServiceBindings, logger: ILogger) {
	return await createDatabase(env.DATABASE_URL, logger);
}

function createWorkerCacheStore(
	env: AuthServiceBindings,
	logger: ILogger,
	tracer: ITracer
) {
	if (!env.KV_CACHE) {
		throw new Error("Missing KV_CACHE binding");
	}

	return new CacheStore(env.KV_CACHE, logger, tracer);
}

async function getApp(env: AuthServiceBindings): Promise<Hono<AuthServieEnv>> {
	const tracer = createWorkerTracer();
	const logger = createWorkerLogger(env);
	const { db } = await createWorkerDatabase(env, logger);
	const cache = createWorkerCacheStore(env, logger, tracer);

	return createApp({
		logger,
		tracer,
		database: db,
		cacheStore: cache,
		kinde: {
			domain: env.KINDE_DOMAIN,
			clientId: env.KINDE_M2M_CLIENT_ID,
			clientSecret: env.KINDE_M2M_CLIENT_SECRET,
		},
	});
}

const handler = {
	async fetch(
		request: Request,
		env: AuthServiceBindings,
		ctx: ExecutionContext<AuthServieEnv>
	) {
		const app = await getApp(env);
		return app.fetch(request, env, ctx);
	},
};

export default handler;
