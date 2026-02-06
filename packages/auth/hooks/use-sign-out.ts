<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { MutationOptions } from "../types";

export type UseSignOutResult = {
	signOut: () => void;
	isPending: boolean;
};

export const useSignOut = (
	redirectUrl: string,
	options?: MutationOptions
): UseSignOutResult => {
	const queryClient = useQueryClient();
	const { authClient, replace } = useAuthContext();

	const { mutate: signOut, isPending } = useMutation({
		mutationFn: async () => {
			await authClient.signOut();
		},

<<<<<<< HEAD
<<<<<<< HEAD
		onSuccess: () => {
			// Clear client state AFTER sign-out succeeds
			queryClient.cancelQueries();
			queryClient.clear();
			queryClient.resetQueries();

			options?.onSuccess?.();
			replace(redirectUrl);
		},

=======
		onMutate: async () => {
			await queryClient.cancelQueries();
			queryClient.clear();
		},
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
		onSuccess: () => {
			// Clear client state AFTER sign-out succeeds
			queryClient.cancelQueries();
			queryClient.clear();
			queryClient.resetQueries();

			options?.onSuccess?.();
			replace("/sign-in");
		},
<<<<<<< HEAD
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======

>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
		onError: (error: Error) => {
			console.error("Error Signing out", error);
			options?.onError?.(error);
		},
	});

	return {
		signOut,
		isPending,
	};
};
