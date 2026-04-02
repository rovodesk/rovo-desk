import type { JwtPayload } from "@zero-heads-lab/auth";
import type {
	ActiveSpan,
	ILogger,
	ITracer,
} from "@zero-heads-lab/observability";

export type CoreBindings = {
	KINDE_DOMAIN: string;
	KINDE_ISSUER_URL: string;
	WRANGLER_LOG: string;
	CLOUDFLARE_ENV: "development" | "staging" | "production";
	DATABASE_URL: string;
	logger: ILogger;
	tracer: ITracer;
};

export type CoreVariables = {
	auth?: JwtPayload;
	jwtToken?: string;
	span: ActiveSpan;
	requestId: string;
	traceId: string;
};

export type WorkerEnv<
	// biome-ignore lint/complexity/noBannedTypes: Need
	TBindings extends Record<string, unknown> = {},
	// biome-ignore lint/complexity/noBannedTypes: Need
	TVariables extends Record<string, unknown> = {},
> = {
	Bindings: CoreBindings & TBindings;
	Variables: CoreVariables & TVariables;
};
