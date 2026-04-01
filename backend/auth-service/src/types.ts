import type { GlobalEnv } from "@zero-heads-lab/global/env";

export type Bindings = GlobalEnv["Bindings"] & {
	// add more worker bindings here later
	DATABASE_URL?: string;
};

export type Variables = GlobalEnv["Variables"] & {
	requestId?: string;
	traceId?: string;
	spanId?: string;
	userId?: string;
	orgCode?: string;
};

export type AppContext = {
	Bindings: Bindings;
	Variables: Variables;
};
