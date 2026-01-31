import { passkeyClient } from "@better-auth/passkey/client";
import {
	inferAdditionalFields,
	magicLinkClient,
	multiSessionClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { accessControl, admin, member, owner } from "../access-control";
import { keys } from "../keys";
import type { AuthInstance } from "../types";

export const authClient = createAuthClient({
	baseURL: keys.VITE_BETTER_AUTH_URL,
	basePath: keys.VITE_BETTER_AUTH_BASE_PATH,
	plugins: [
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
	],
});
