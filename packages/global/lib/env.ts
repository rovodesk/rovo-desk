import type {
	ILogger,
	ITracer,
	OtelContext,
	Span,
} from "@zero-heads-lab/observability";

export type CoreBindings = {
	WRANGLER_LOG: string;
	WORKER_ENV: "development" | "staging" | "production";
};

export type CoreVariables = {
	requestId: string;
	span: Span;
	ctx: OtelContext;
	logger: ILogger;
	tracer: ITracer;
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
