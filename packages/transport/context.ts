import { os } from "@orpc/server";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import type { createAuth } from "@zero-heads-lab/auth/server";
import type { AuthSession, AuthUser } from "@zero-heads-lab/auth/types";

export interface ORPCContext extends RequestHeadersPluginContext {
	auth?: ReturnType<typeof createAuth>;
	session?: AuthSession;
	user?: AuthUser;
}

export const base = os.$context<ORPCContext>();
