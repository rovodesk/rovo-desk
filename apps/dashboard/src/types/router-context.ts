import type { QueryClient } from "@tanstack/react-query";
import type { Session } from "@zero-heads-lab/auth/types";

export type RouterContext = {
	queryClient: QueryClient;
	auth: {
		session: Session | null;
		isAuthenticated: boolean;
		isAnonymous: boolean;
		onboarding?: {
			isCompleted: boolean;
			currentStep: string;
		};
	};
};
