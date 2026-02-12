import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { MutationOptions, OAuthProvider } from "../types";

export const useOauthSignIn = (
	callbackURL: string,
	options?: MutationOptions
) => {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	const {
		mutate: signInWithOAuth,
		isPending,
		variables,
	} = useMutation({
		mutationFn: async (provider: OAuthProvider) => {
			return await authClient.signIn.social({
				requestSignUp: true,
				provider,
				callbackURL,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["auth", "session"],
			});
			options?.onSuccess?.();
		},
		onError: (error) => {
			console.error("Error signing in", error);
			options?.onError?.(error);
		},
	});

	return {
		signInWithOAuth,
		isPending,
		variables,
	};
};
