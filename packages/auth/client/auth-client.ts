import { passkeyClient } from "@better-auth/passkey/client";
// import { polarClient } from "@polar-sh/better-auth/client";
import type { BetterAuthClientPlugin } from "better-auth";
import {
	adminClient,
	inferAdditionalFields,
	lastLoginMethodClient,
	magicLinkClient,
	multiSessionClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient as createBetterAuthClient } from "better-auth/react";
import { AllRoles, accessControl } from "../access-control";
// import { keys } from "../keys";
import type { AuthInstance } from "../types";

const Plugins = [
	inferAdditionalFields<AuthInstance>(),
	organizationClient({
		accessControl,
		roles: {
			...AllRoles,
		},
		teams: {
			enabled: true,
		},
	}),
	multiSessionClient(),
	magicLinkClient(),
	passkeyClient(),
	// polarClient(),
	adminClient(),
	lastLoginMethodClient(),
] satisfies BetterAuthClientPlugin[];

export function createAuthClient(baseURL: string, basePath: string) {
	return createBetterAuthClient({
		baseURL,
		basePath,
		plugins: Plugins,
	});
}
