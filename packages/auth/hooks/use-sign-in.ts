import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
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
		mutationFn: (provider) => {
			if (!callbackURL) throw new Error("VITE_SIGN_IN_CALLBACK_URL is not set");
			return authClient.signIn.social({
				requestSignUp: true,
				provider,
				callbackURL,
			});
		},
		onSuccess: handleSessionSync,
		onError: (err) => options?.onError?.(err),
	});

	/* ================================================= */
	/* =============== MAGIC LINK SIGN IN ============== */
	/* ================================================= */

	const magicLinkMutation = useMutation<unknown, Error, { email: string }>({
		mutationFn: ({ email }) => {
			if (!callbackURL) throw new Error("VITE_SIGN_IN_CALLBACK_URL is not set");

			return authClient.signIn.magicLink({
				email,
				name: capitalize(Placeholder.name(2, " ")),
				callbackURL,
			});
		},

		onSuccess: () => {
			toast.success("Email Sent", {
				description: "Login link sent to your email inbox.",
			});
			handleSessionSync();
		},
		onError: (err) => options?.onError?.(err),
	});

	const ssoMutation = useMutation<unknown, Error, { email: string }>({
		mutationFn: ({ email }) => {
			if (!callbackURL) throw new Error("VITE_SIGN_IN_CALLBACK_URL is not set");

			return authClient.signIn.sso({
				email,
				callbackURL,
			});
		},
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
		passkeyMutation.isPending ||
		ssoMutation.isPending;

	const error =
		oauthMutation.error ||
		magicLinkMutation.error ||
		passkeyMutation.error ||
		ssoMutation.error ||
		null;

	const refetch = () =>
		queryClient.invalidateQueries({
			queryKey: ["auth", "session"],
		});

	return {
		signInWithOAuth: oauthMutation.mutate,
		signInWithOAuthAsync: oauthMutation.mutateAsync,

		signInWithMagicLink: magicLinkMutation.mutate,
		signInWithMagicLinkAsync: magicLinkMutation.mutateAsync,

		signInWithPasskey: passkeyMutation.mutate,
		signInWithPasskeyAsync: passkeyMutation.mutateAsync,

		signInWithSSO: ssoMutation.mutate,
		signInWithSSOAsync: ssoMutation.mutateAsync,

		// Last login
		lastLoginMethod: lastLoginQuery.data ?? null,

		loading,
		error,
		refetch,
	};
}
