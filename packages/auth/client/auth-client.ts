import { passkeyClient } from "@better-auth/passkey/client";
<<<<<<< HEAD
<<<<<<< HEAD
// import { polarClient } from "@polar-sh/better-auth/client";
=======
import { polarClient } from "@polar-sh/better-auth/client";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
// import { polarClient } from "@polar-sh/better-auth/client";
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
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
<<<<<<< HEAD
import { AllRoles, accessControl } from "../access-control";
// import { keys } from "../keys";
=======
import { accessControl, admin, member, owner } from "../access-control";
import { keys } from "../keys";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import type { AuthInstance } from "../types";

const Plugins = [
	inferAdditionalFields<AuthInstance>(),
	organizationClient({
		accessControl,
		roles: {
<<<<<<< HEAD
			...AllRoles,
=======
			owner,
			admin,
			member,
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
		},
		teams: {
			enabled: true,
		},
	}),
	multiSessionClient(),
	magicLinkClient(),
	passkeyClient(),
<<<<<<< HEAD
<<<<<<< HEAD
	// polarClient(),
	adminClient(),
	lastLoginMethodClient(),
] satisfies BetterAuthClientPlugin[];

export function createAuthClient(baseURL: string, basePath: string) {
	return createBetterAuthClient({
		baseURL,
		basePath,
=======
	polarClient(),
=======
	// polarClient(),
	lastLoginMethodClient(),
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
] satisfies BetterAuthClientPlugin[];

export function authClient() {
	return createBetterAuthClient({
		baseURL: keys.VITE_AUTH_BASE_URL,
		basePath: keys.VITE_AUTH_BASE_PATH,
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
		plugins: Plugins,
	});
}
