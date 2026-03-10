import { apiKeyClient } from "@better-auth/api-key/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { ssoClient } from "@better-auth/sso/client";
import { stripeClient } from "@better-auth/stripe/client";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import type { BetterAuthClientPlugin } from "better-auth";
import {
	adminClient,
	inferAdditionalFields,
	inferOrgAdditionalFields,
	jwtClient,
	lastLoginMethodClient,
	magicLinkClient,
	multiSessionClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import { accessControl, Roles } from "../access-control";
import type { AuthInstance } from "../types";
import { keys } from "./keys";

const Plugins = [
	inferAdditionalFields<AuthInstance>(),
	organizationClient({
		accessControl,
		roles: {
			...Roles,
		},
		teams: {
			enabled: true,
		},
		schema: inferOrgAdditionalFields<AuthInstance>(),
	}),
	multiSessionClient(),
	magicLinkClient(),
	passkeyClient(),
	stripeClient({
		subscription: true,
	}),
	adminClient(),
	lastLoginMethodClient(),
	apiKeyClient(),
	jwtClient(),
	ssoClient(),
] satisfies BetterAuthClientPlugin[];

export const authClient = createBetterAuthClient({
	baseURL: keys.VITE_AUTH_SERVER_URL,
	basePath: keys.VITE_AUTH_SERVER_BASE_PATH,
	plugins: Plugins,
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error("Too many requests. Please try again later.");
			}
		},
	},
});
