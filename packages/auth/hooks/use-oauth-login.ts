import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { MutationOptions, OAuthProvider } from "../types";

export const useOauthSignIn = (options?: MutationOptions) => {
	const { authClient } = useAuthContext();

	const {
		mutate: signInWithOAuth,
		isPending,
		variables,
	} = useMutation({
		mutationFn: async (provider: OAuthProvider) => {
			return await authClient.signIn.social({
				requestSignUp: true,
				provider,
				callbackURL: "/",
			});
		},
		onSuccess: () => {
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
