import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "@zero-heads-lab/backend";

export const authClient = createAuthClient({
	plugins: [convexClient()],
});
