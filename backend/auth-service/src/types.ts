import type { ICacheStore } from "@zero-heads-lab/cache";
import type { WorkerEnv } from "@zero-heads-lab/global";
import type { KindeCredentialsClient } from "./lib/auth-client";
import type { UserRepository } from "./modules/user/repository";

export type AuthServiceBindings = WorkerEnv["Bindings"] & {
	// add more worker bindings here later
	DATABASE_URL: string;
	AUTH_EVENTS_QUEUE: Queue;
	KV_CACHE: KVNamespace<string>;
	KINDE_DOMAIN: string;
	KINDE_M2M_CLIENT_ID: string;
	KINDE_M2M_CLIENT_SECRET: string;
};

export type KindeConfig = {
	domain: string;
	clientId: string;
	clientSecret: string;
};

export type AuthServiceVariables = WorkerEnv["Variables"] & {
	repositories: {
		userRepository: UserRepository;
	};
	cacheStore: ICacheStore;
	authClient: KindeCredentialsClient;
};

export type AuthServieEnv = {
	Bindings: AuthServiceBindings;
	Variables: AuthServiceVariables;
};
