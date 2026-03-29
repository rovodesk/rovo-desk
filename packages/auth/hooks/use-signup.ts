import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "client/context";
import { extractNameFromEmail } from "helpers";

type UseSignUpOptions = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
};

export function useSignUp(callbackURL?: string, options?: UseSignUpOptions) {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	const handleSessionSync = async () => {
		await queryClient.invalidateQueries({
			queryKey: ["auth", "session"],
		});
		options?.onSuccess?.();
	};

	/* ================================================= */
	/* ============== MAGIC LINK SIGNUP ================ */
	/* ================================================= */

	const magicLinkMutation = useMutation<unknown, Error, { email: string }>({
		mutationFn: async ({ email }) => {
			if (!callbackURL) throw new Error("Callback URL missing");

			return await authClient.signIn.magicLink({
				email,
				name: extractNameFromEmail(email),
				callbackURL,
			});
		},
		onSuccess: () => {
			// show "check your email"
		},
		onError: (err) => options?.onError?.(err),
	});

	/* ================================================= */
	/* ===================== SSO ======================= */
	/* ================================================= */

	const ssoMutation = useMutation<unknown, Error, { email: string }>({
		mutationFn: async ({ email }) => {
			if (!callbackURL) throw new Error("Callback URL missing");

			return await authClient.signIn.sso({
				email,
				callbackURL,
			});
		},
		onSuccess: handleSessionSync,
		onError: (err) => options?.onError?.(err),
	});

	/* ================================================= */
	/* ================== OAUTH ======================== */
	/* ================================================= */

	const oauthSignUpMutation = useMutation({
		mutationFn: (provider: OAuth) => {
			if (!callbackURL) throw new Error("Callback URL missing");

			return authClient.signIn.social({
				provider,
				requestSignUp: true,
				callbackURL,
			});
		},
		onSuccess: handleSessionSync,
		onError: (err) => options?.onError?.(err),
	});

	return {
		signUpWithMagicLink: magicLinkMutation.mutate,
		signUpWithSSO: ssoMutation.mutate,
		signUpWithOAuth: oauthSignUpMutation,

		loading:
			magicLinkMutation.isPending ||
			ssoMutation.isPending ||
			oauthSignUpMutation.isPending,

		error:
			magicLinkMutation.error ||
			ssoMutation.error ||
			oauthMutation.error ||
			null,
	};
}
