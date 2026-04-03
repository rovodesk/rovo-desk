import { Logger, type LogLevel, Tracer } from "@zero-heads-lab/observability";
import type { ApiGatewayServiceEnv } from "@/types";
import { name, version } from "../package.json";

function createWorkerTracer(): Tracer {
	return new Tracer({
		app: name,
		version,
	});
}

function createWorkerLogger(env: ApiGatewayServiceEnv): Logger {
	return new Logger({
		level: env.Bindings.WRANGLER_LOG as LogLevel,
		debug: env.Bindings.WORKER_ENV !== "production",
		mode: env.Bindings.WORKER_ENV === "production" ? "json" : "pretty",
		app: name,
		version,
	});
}

const handler = {
	// async fetch(
	// 	request: Request,
	// 	env: WebhooksServiceBindings,
	// 	ctx: ExecutionContext
	// ) {
	// 	const logger = createWorkerLogger(env);

	// 	const app = createApp({ logger, tracer });

	// 	return await app.fetch(request, env, ctx);
	// },
	// biome-ignore lint/suspicious/useAwait: No awaited func
	async queue(batch, env, _ctx): Promise<void> {
		const _tracer = createWorkerTracer();
		const logger = createWorkerLogger(env);

		// const app = createApp({ logger, tracer });

		for (const message of batch.messages) {
			logger.info("consumed from our queue", {
				body: message.body,
			});
			message.ack();
		}
	},
} satisfies ExportedHandler<ApiGatewayServiceEnv>;

export default handler;
