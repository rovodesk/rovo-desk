import type { Analytics } from "@zero-heads-lab/analytics/lib/analytics";
import type { ILogger, ITracer } from "@zero-heads-lab/analytics/types";
import type {
	AuthInstance,
	AuthSession,
	AuthUser,
} from "@zero-heads-lab/auth/types";
import type { IBilling } from "@zero-heads-lab/billing/types";
import type { ICacheStore } from "@zero-heads-lab/cache/interface";
import type { STRIPE_WEBHOOK_MESSAGE_EVENT } from "@zero-heads-lab/contract/event/stripe";
import type { Database } from "@zero-heads-lab/database";
import type { IQueueService } from "@zero-heads-lab/queue/interface";

export type SecretLike = string | SecretsStoreSecret;

export type Bindings = {
	KNOWLEDGE_BASE: DurableObjectNamespace;
	CHAT_ROOM: DurableObjectNamespace;
	CACHE_STORE: KVNamespace;
	EMAIL_QUEUE: Queue;
	STRIPE_EVENTS_QUEUE: Queue<STRIPE_WEBHOOK_MESSAGE_EVENT>;
	POSTHOG_API_KEY: SecretLike;
	DATABASE_URL: SecretLike;
	BETTER_AUTH_SECRET: SecretLike;
	GOOGLE_CLIENT_ID: SecretLike;
	GOOGLE_CLIENT_SECRET: SecretLike;
	GITHUB_CLIENT_ID: SecretLike;
	GITHUB_CLIENT_SECRET: SecretLike;
	AWS_COGNITO_CLIENT_ID: SecretLike;
	AWS_COGNITO_CLIENT_SECRET: SecretLike;
	AWS_COGNITO_DOMAIN: SecretLike;
	AWS_COGNITO_USER_POOL_ID: SecretLike;
	STRIPE_SECRET_KEY: SecretLike;
	STRIPE_WEBHOOK_SECRET: SecretLike;

	LOG_LEVEL: string;
	POSTHOG_HOST: string;
	BETTER_AUTH_URL: string;
	ANALYTICS_ENABLED: string;
	ALLOWED_ORIGINS: string;
	AWS_REGION: string;
};

export type Variables = {
	CACHE: ICacheStore;
	ANALYTICS: Analytics;
	LOGGER: ILogger;
	TRACER: ITracer;
	EMAIL_QUEUE: IQueueService;
	STRIPE_EVENTS_QUEUE: IQueueService;
	BILLING: IBilling;
	AUTH: AuthInstance;
	DATABASE: Database;
	SESSION?: AuthSession | null;
	USER?: AuthUser | null;
};

export type Identity = {
	"x-user-id": string;
	"x-org-id": string;
	"x-role": string;
	"x-token"?: string;
};

export type PartyBindings = {
	// Only include what this realtime room actually needs
	// Example:
	DATABASE_URL?: SecretsStoreSecret;
	DOC_SNAPSHOT_BUCKET?: R2Bucket;
};
