import type { Database } from "@zero-heads-lab/database";

export type Bindings = {
	AUTH_CACHE: KVNamespace;
	DATABASE: Database;
	KNOWLEDGE_BASE: DurableObjectNamespace;
	CHAT_ROOM: DurableObjectNamespace;
	SDK_CACHE: KVNamespace;
	SDK_JWT_SECRET: string;
	ALLOWED_ORIGINS: string;
};
