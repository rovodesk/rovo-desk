import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { capitalize, Placeholder } from "@zero-heads-lab/shared/utils";
import { useEffect } from "react";
import { keys } from "../client";
import { useAuthContext } from "../client/context";
import type { MutationOptions, OAuthProvider } from "../types";

type UseSignInOptions = MutationOptions;

export function useSignIn(options?: UseSignInOptions) {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	const callbackURL = keys.VITE_SIGN_IN_CALLBACK_URL;

	// Loading
	const lastLoginQuery = useQuery<string | null>({
		queryKey: ["auth", "last-login-method"],
		queryFn: () => authClient.getLastUsedLoginMethod(),
	});

	/* ================================================= */
	/* ============= Shared Success Handler ============ */
	/* ================================================= */

	const handleSessionSync = async () => {
		await queryClient.invalidateQueries({
			queryKey: ["auth", "session"],
		});
		options?.onSuccess?.();
	};

	/* ================================================= */
	/* ================= OAUTH SIGN IN ================= */
	/* ================================================= */

	const oauthMutation = useMutation<unknown, Error, OAuthProvider>({
		mutationFn: (provider) =>
			authClient.signIn.social({
				requestSignUp: true,
				provider,
				callbackURL,
			}),
		onSuccess: handleSessionSync,
		onError: (err) => options?.onError?.(err),
	});

	/* ================================================= */
	/* =============== MAGIC LINK SIGN IN ============== */
	/* ================================================= */

	const magicLinkMutation = useMutation<unknown, Error, { email: string }>({
		mutationFn: ({ email }) =>
			authClient.signIn.magicLink({
				email,
				name: capitalize(Placeholder.name(2, " ")),
				callbackURL,
			}),
		onSuccess: handleSessionSync,
		onError: (err) => options?.onError?.(err),
	});

	/* ================================================= */
	/* ================= PASSKEY SIGN IN =============== */
	/* ================================================= */

	const passkeyMutation = useMutation<unknown, Error, void>({
		mutationFn: async () => {
			const { data, error } = await authClient.signIn.passkey({
				autoFill: true,
			});

			if (error) {
				throw new Error(error.message || "Passkey authentication failed");
			}

			return data;
		},

		onSuccess: () => {
			options?.onSuccess?.();
			window.location.href = "/";
		},

		onError: (err) => {
			// Ignore silent cancellation
			if (
				err.message.includes("User cancelled") ||
				err.message.includes("abort")
			) {
				return;
			}

			options?.onError?.(err);
		},
	});

	/* ================================================= */
	/* ============== PASSKEY AUTO FILL ================ */
	/* ================================================= */

	useEffect(() => {
		if (!PublicKeyCredential.isConditionalMediationAvailable?.()) {
			return;
		}

		authClient.signIn.passkey({
			autoFill: true,
		});
	}, [authClient]);

	/* ================================================= */
	/* =============== UNIFIED STATE =================== */
	/* ================================================= */

	const loading =
		oauthMutation.isPending ||
		magicLinkMutation.isPending ||
		passkeyMutation.isPending;

	const error =
		oauthMutation.error ||
		magicLinkMutation.error ||
		passkeyMutation.error ||
		null;

	const refetch = () =>
		queryClient.invalidateQueries({
			queryKey: ["auth", "session"],
		});

	return {
		signInWithOAuth: oauthMutation.mutate,
		signInWithMagicLink: magicLinkMutation.mutate,
		signInWithPasskey: passkeyMutation.mutate,

		// Last login
		lastLoginMethod: lastLoginQuery.data ?? null,

		loading,
		error,
		refetch,
	};
}
