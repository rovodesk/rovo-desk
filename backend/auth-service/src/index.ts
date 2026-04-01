import type { GlobalEnv } from "@zero-heads-lab/global/env";
import { Logger, type LogLevel, Tracer } from "@zero-heads-lab/observability";
import { name, version } from "../package.json";
import { createApp } from "./routes";

const tracer = new Tracer({
	app: name,
	version,
});

const handler = {
	async fetch(
		request: Request,
		env: GlobalEnv["Bindings"],
		ctx: ExecutionContext
	) {
		const logger = new Logger({
			level: env.WRANGLER_LOG as LogLevel,
			debug: env.CLOUDFLARE_ENV !== "production",
			mode: env.CLOUDFLARE_ENV === "production" ? "json" : "pretty",
			app: name,
			version,
		});

		const app = createApp({ logger, tracer });

		return await app.fetch(request, env, ctx);
	},
};

/**
 * Instrumentation with Axiom
 */
// export default startInstrumentation(handler);

/**
 * Without Instrumentation [ Cloudflare Native observability]
 */
export default handler;
