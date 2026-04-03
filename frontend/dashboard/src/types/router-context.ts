import type { QueryClient } from "@tanstack/react-query";
import type { AuthContext } from "@zero-heads-lab/auth/lib/types";

export type RouterContext = {
	queryClient: QueryClient;
	auth: AuthContext;
	onboarding?: {
		complete: boolean;
		step: string;
	};
};
