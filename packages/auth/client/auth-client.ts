import { passkeyClient } from "@better-auth/passkey/client";
// import { polarClient } from "@polar-sh/better-auth/client";
import type { BetterAuthClientPlugin } from "better-auth";
import {
	inferAdditionalFields,
	lastLoginMethodClient,
	magicLinkClient,
	multiSessionClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import { accessControl, admin, member, owner } from "../access-control";
import { keys } from "../keys";
import type { AuthInstance } from "../types";

const Plugins = [
	inferAdditionalFields<AuthInstance>(),
	organizationClient({
		accessControl,
		roles: {
			owner,
			admin,
			member,
		},
		teams: {
			enabled: true,
		},
	}),
	multiSessionClient(),
	magicLinkClient(),
	passkeyClient(),
	// polarClient(),
	lastLoginMethodClient(),
] satisfies BetterAuthClientPlugin[];

export function authClient() {
	return createBetterAuthClient({
		baseURL: keys.VITE_AUTH_BASE_URL,
		basePath: keys.VITE_AUTH_BASE_PATH,
		plugins: Plugins,
	});
}
