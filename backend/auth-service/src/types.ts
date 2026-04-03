import type { ICacheStore } from "@zero-heads-lab/cache";
import type { WorkerEnv } from "@zero-heads-lab/global";
import type { UserRepository } from "./modules/user/repository";

type AUTH_EVENTS = {
	type: 
}

export type Bindings = WorkerEnv["Bindings"] & {
	// add more worker bindings here later
	DATABASE_URL?: string;
	AUTH_SERVICE_QUEUE: Queue<AUTH_MESSAGES>;
	KV: KVNamespace<string>;
	KINDE_CLIENT_ID: string;
	KINDE_CLIENT_SECRET: string;
	KINDE_REDIRECT_URL: string;
	KINDE_LOGOUT_REDIRECT_URL: string;
};

export type Variables = WorkerEnv["Variables"] & {
	userId?: string;
	orgId?: string;
	database: UserRepository;
	cacheStore: ICacheStore;
};

export type AuthServieEnv = {
	Bindings: Bindings;
	Variables: Variables;
};
