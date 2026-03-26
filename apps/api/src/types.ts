import type { Analytics } from "@zero-heads-lab/analytics/lib/analytics";
import type { Logger } from "@zero-heads-lab/analytics/lib/logger";
import type { Tracer } from "@zero-heads-lab/analytics/lib/tracer";
import type { AuthSession, AuthUser } from "@zero-heads-lab/auth/types";
import type { Database } from "@zero-heads-lab/database";

export type Bindings = {
	KNOWLEDGE_BASE: DurableObjectNamespace;
	CHAT_ROOM: DurableObjectNamespace;
	CACHE_STORE: KVNamespace;
	POSTHOG_PROJECT_API_KEY: string;
	POSTHOG_HOST: string;
	ALLOWED_ORIGINS: string;
	JWT_SECRET: string;
	DATABASE_URL: string;
	LOG_LEVEL?: string;
	ANALYTICS_ENABLED?: string;
	AXIOM_DOMAIN: string;
	AXIOM_TOKEN: string;
	AXIOM_DATASET: string;
};

export type Variables = {
	ANALYTICS: Analytics;
	IDENTITY: Identity;
	LOGGER: Logger;
	TRACER: Tracer;
	DATABASE: Database;
	SESSION: AuthSession | null;
	USER: AuthUser | null;
};

export type Identity = {
	"x-user-id": string;
	"x-org-id": string;
	"x-role": string;
	"x-token"?: string;
};
