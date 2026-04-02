import { Logger, type LogLevel, Tracer } from "@zero-heads-lab/observability";
import { createApp } from "@/app";
import type { WebhooksServiceBindings } from "@/types";
import { name, version } from "../package.json";

const tracer = new Tracer({
	app: name,
	version,
});

function createWorkerLogger(env: WebhooksServiceBindings): Logger {
	return new Logger({
		level: env.WRANGLER_LOG as LogLevel,
		debug: env.CLOUDFLARE_ENV !== "production",
		mode: env.CLOUDFLARE_ENV === "production" ? "json" : "pretty",
		app: name,
		version,
	});
}

const handler = {
	async fetch(
		request: Request,
		env: WebhooksServiceBindings,
		ctx: ExecutionContext
	) {
		const logger = createWorkerLogger(env);

		const app = createApp({ logger, tracer });

		return await app.fetch(request, env, ctx);
	},
};

export default handler;
