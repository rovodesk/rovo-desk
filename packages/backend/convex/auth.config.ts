import type { AuthConfig } from "convex/server";
import { keys } from "../keys";

export default {
	providers: [
		{
			domain: keys.CLERK_JWT_ISSUER_DOMAIN,
			applicationID: "convex",
		},
	],
} satisfies AuthConfig;
