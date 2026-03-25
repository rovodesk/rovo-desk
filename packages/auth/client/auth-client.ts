import { apiKeyClient } from "@better-auth/api-key/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { ssoClient } from "@better-auth/sso/client";
import { stripeClient } from "@better-auth/stripe/client";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import {
	adminClient,
	anonymousClient,
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
	adminClient({
		accessControl,
		roles: { ...Roles },
	}),
	lastLoginMethodClient(),
	apiKeyClient(),
	jwtClient(),
	ssoClient(),
	anonymousClient(),
];

export const authClient = createAuthClient(
	keys.VITE_AUTH_SERVER_URL,
	keys.VITE_AUTH_SERVER_BASE_PATH
);

export function createAuthClient(baseURL: string, basePath: string) {
	return createBetterAuthClient({
		baseURL,
		basePath,
		plugins: Plugins,
		fetchOptions: {
			onError(e) {
				if (e.error.status === 429) {
					toast.error("Too many requests. Please try again later.");
				}
			},
		},
	});
}
