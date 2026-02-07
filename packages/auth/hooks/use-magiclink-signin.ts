<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client"

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

import { useMutation } from "@tanstack/react-query";
import { capitalize, Placeholder } from "@zero-heads-lab/shared/utils";
import { useAuthContext } from "../client/context";
import type { MutationOptions } from "../types";

<<<<<<< HEAD
export const useMagicLinkSignIn = (
		callbackURL: string,
		options?: MutationOptions
	) => {
		=======
		export const useMagicLinkSignIn = (options?: MutationOptions) => {
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
	const { authClient } = useAuthContext();

	const { mutate: signInWithMagicLink, isPending } = useMutation({
		mutationFn: async ({ email }: { email: string }) => {
			return await authClient.signIn.magicLink({
				email,
				name: capitalize(Placeholder.name(2, " ")),
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
		signInWithMagicLink,
		isPending,
	};
}
