<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { MutationOptions } from "../types";

export type UseSignOutResult = {
	signOut: () => void;
	isPending: boolean;
};

export const useSignOut = (options?: MutationOptions): UseSignOutResult => {
	const queryClient = useQueryClient();
	const { authClient, replace } = useAuthContext();

	const { mutate: signOut, isPending } = useMutation({
		mutationFn: async () => {
			await authClient.signOut();
		},

<<<<<<< HEAD
		onSuccess: () => {
			// Clear client state AFTER sign-out succeeds
			queryClient.cancelQueries();
			queryClient.clear();
			queryClient.resetQueries();

			options?.onSuccess?.();
			replace("/sign-in");
		},

=======
		onMutate: async () => {
			await queryClient.cancelQueries();
			queryClient.clear();
		},
		onSuccess: () => {
			options?.onSuccess?.();
			throw replace("/sign-in");
		},
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
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
