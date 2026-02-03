import { useMutation } from "@tanstack/react-query";
import { capitalize, Placeholder } from "@zero-heads-lab/shared/utils";
import { useAuthContext } from "../client/context";
import type { MutationOptions } from "../types";

export const useMagicLinkSignIn = (options?: MutationOptions) => {
	const { authClient } = useAuthContext();

	const { mutate: signInWithMagicLink, isPending } = useMutation({
		mutationFn: async ({ email }: { email: string }) => {
			return await authClient.signIn.magicLink({
				email,
				name: capitalize(Placeholder.name(2, " ")),
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
		signInWithMagicLink,
		isPending,
	};
};
