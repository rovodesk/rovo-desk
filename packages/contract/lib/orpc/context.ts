import type {
	IAnalytics,
	ILogger,
	ITracer,
} from "@zero-heads-lab/analytics/types";
import type {
	AuthInstance,
	AuthSession,
	AuthUser,
} from "@zero-heads-lab/auth/types";
import type { Database } from "@zero-heads-lab/database";

/**
 * ORPC Context
 * @description This interface is used to define the context for the ORPC server.
 * It is used to pass data between procedures. It already extends RequestHeadersPluginContext from @orpc/server/plugins
 *
 * @property auth - Auth instance
 * @property session - Auth session
 * @property user - Auth user
 */
export interface ORPCContext {
	headers?: Headers;
	auth?: AuthInstance;
	analytics?: IAnalytics;
	logger?: ILogger;
	tracer?: ITracer;
	database?: Database;
	session?: AuthSession;
	user?: AuthUser;
	organizationId?: string;
	chatbotId?: string;
	chatbotConnectionId?: string;
	role?: string;
}
