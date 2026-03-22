import { Analytics } from "@zero-heads-lab/analytics/types";
import { AuthInstance } from "@zero-heads-lab/auth/types";
import type { Database } from "@zero-heads-lab/database";

export type Bindings = {
	DATABASE: Database;
	KNOWLEDGE_BASE: DurableObjectNamespace;
	CHAT_ROOM: DurableObjectNamespace;
	CACHE_STORE: KVNamespace;
	POSTHOG_PROJECT_API_KEY: string;
	ALLOWED_ORIGINS: string;
};

export type Variables = {
	analytics: Analytics;
}