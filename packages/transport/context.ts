import { os } from "@orpc/server";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import type { Analytics } from "@zero-heads-lab/analytics/types";
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
export interface ORPCContext extends RequestHeadersPluginContext {
	auth?: AuthInstance;
	analytics?: Analytics;
	database?: Database;
	session?: AuthSession;
	user?: AuthUser;
	organizationId?: string;
	chatbotId?: string;
	chatbotConnectionId?: string;
}

export const base = os.$context<ORPCContext>();
