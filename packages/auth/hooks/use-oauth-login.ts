<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client"

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { MutationOptions, OAuthProvider } from "../types";

<<<<<<< HEAD
export const useOauthSignIn = (
		callbackURL: string,
		options?: MutationOptions
	) => {
		=======
		export const useOauthSignIn = (options?: MutationOptions) => {
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
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
<<<<<<< HEAD
				callbackURL,
=======
				callbackURL: "/",
>>>>>>> 8_137_094 (feat: roles and basic permissions addded, optimzed and refactored)
			});
		},
		onSuccess: () => {
			options?.onSuccess?.();
	},
	onError: (error) => {
			console.error("Error signing in",
	error;
)
options?.onError?.(error);
},
	})

return {
		signInWithOAuth,
		isPending,
		variables,
	};
}
