import { createAuthClient } from "@zero-heads-lab/auth/client";
import { env } from "../env";

export const authClient = createAuthClient(
	env.VITE_BETTER_AUTH_URL,
	env.VITE_BETTER_AUTH_BASE_PATH
);
