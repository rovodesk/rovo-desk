import type { JwtPayload } from "@zero-heads-lab/auth";
import type { ActiveSpan, ITracer } from "@zero-heads-lab/observability";
import type { ILogger } from "@zero-heads-lab/observability/";

export type GlobalBindings =
	// InstrumentationEnv & {
	{
		KINDE_DOMAIN: string;
		KINDE_ISSUER?: string;
		WRANGLER_LOG: string;
		CLOUDFLARE_ENV: "development" | "staging" | "production";
		SERVICE_NAME: string;
		SERVICE_VERSION: string;
	};

export type GlobalEnv = {
	Bindings: GlobalBindings;
	Variables: {
		auth: JwtPayload;
		jwtToken: string;
		logger: ILogger;
		tracer: ITracer;
		span: ActiveSpan;
	};
};
