import type { QueryClient } from "@tanstack/react-query";
import type { Session } from "@zero-heads-lab/auth/types";

export type RouterContext = {
<<<<<<< HEAD
	queryClient: QueryClient;
	auth: {
		session: Session | null;
		isAuthenticated: boolean;
		// onboarding: {
		//     isCompleted: boolean;
		//     currentStep: string;
		// };
	};
=======
    queryClient: QueryClient;
    auth: {
        session: Session | null;
        isAuthenticated: boolean;
        // onboarding: {
        //     isCompleted: boolean;
        //     currentStep: string;
        // };
    };
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
};
