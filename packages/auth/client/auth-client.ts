import { passkeyClient } from "@better-auth/passkey/client";
import { stripeClient } from "@better-auth/stripe/client";
import type { BetterAuthClientPlugin } from "better-auth";
import {
	adminClient,
	apiKeyClient,
	inferAdditionalFields,
	inferOrgAdditionalFields,
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
] satisfies BetterAuthClientPlugin[];

export const authClient = createBetterAuthClient({
	baseURL: keys.VITE_AUTH_SERVER_URL,
	basePath: keys.VITE_AUTH_SERVER_BASE_PATH,
	plugins: Plugins,
});
