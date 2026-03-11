import type { Analytics } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";

export type Bindings = {
	CACHE_STORE: KVNamespace;
	DATABASE: Database;
	KNOWLEDGE_BASE: DurableObjectNamespace;
	CHAT_ROOM: DurableObjectNamespace;
	ALLOWED_ORIGINS: string;
	POSTHOG_PROJECT_API_KEY: string;
};

export type Variables = {
	analytics: Analytics;
};
