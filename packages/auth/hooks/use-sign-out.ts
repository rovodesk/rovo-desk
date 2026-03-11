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
		onSuccess: () => {
			// Clear client state AFTER sign-out succeeds
			queryClient.cancelQueries();
			queryClient.clear();

			options?.onSuccess?.();
			replace(redirectUrl);
		},
		onMutate: async () => {
			await queryClient.cancelQueries();
			queryClient.clear();
		},
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
