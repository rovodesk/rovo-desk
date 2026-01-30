import { passkeyClient } from "@better-auth/passkey/client";
import {
	inferAdditionalFields,
	magicLinkClient,
	multiSessionClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { keys } from "../keys";
import type { AuthInstance } from "../types";

export const authClient = createAuthClient({
	baseURL: keys.VITE_BETTER_AUTH_URL,
	basePath: keys.VITE_BETTER_AUTH_BASE_PATH,
	plugins: [
		inferAdditionalFields<AuthInstance>(),
		organizationClient({
			teams: {
				enabled: true,
			},
		}),
		multiSessionClient(),
		magicLinkClient(),
		passkeyClient(),
	],
});
