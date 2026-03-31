import type { QueryClient } from "@tanstack/react-query";

export type RouterContext = {
	queryClient: QueryClient;
	auth: {
		isAuthenticated: boolean;
		// onboarding: {
		//     isCompleted: boolean;
		//     currentStep: string;
		// };
	};
};
