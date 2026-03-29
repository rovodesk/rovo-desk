import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { extractNameFromEmail } from "helpers";
import { useEffect, useRef } from "react";
import { useAuthContext } from "../client/context";
import type { OAuthProvider } from "../types";

type UseSignInOptions = {
	onSessionSync?: () => void;
	onSignInSuccess?: () => void;
	onSignInError?: (error: Error) => void;
};

export function useSignIn<T extends UseSignInOptions>(
	callbackURL?: string,
	newUserCallbackURL?: string,
	options?: T
) {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();
	callbackURL = callbackURL || "/";

	// Loading
	const lastLoginQuery = useQuery<string | null>({
		queryKey: ["auth", "last-login-method"],
		queryFn: () => authClient.getLastUsedLoginMethod(),
	});

	const handleSuccess = async () => {
		options?.onSignInSuccess?.();
		await queryClient.invalidateQueries({
			queryKey: ["auth", "session"],
		});
		options?.onSessionSync?.();
	};

	const handleError = (err: Error) => {
		// Ignore silent cancellation
		if (
			err.message.includes("User cancelled") ||
			err.message.includes("abort")
		) {
			return;
		}
		options?.onSignInError?.(err);
	};

	const oauthMutation = useMutation<unknown, Error, OAuthProvider>({
		mutationFn: async (provider) => {
			if (!callbackURL) throw new Error("VITE_SIGN_IN_CALLBACK_URL is not set");
			await authClient.signIn.social({
				requestSignUp: true,
				provider,
				callbackURL,
				newUserCallbackURL,
			});
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});

	const magicLinkMutation = useMutation<unknown, Error, { email: string }>({
		mutationFn: ({ email }) => {
			if (!callbackURL) throw new Error("VITE_SIGN_IN_CALLBACK_URL is not set");

			return authClient.signIn.magicLink({
				email,
				name: extractNameFromEmail(email),
				callbackURL,
				newUserCallbackURL,
			});
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});

	const ssoMutation = useMutation<unknown, Error, { email: string }>({
		mutationFn: ({ email }) => {
			return authClient.signIn.sso({
				email,
				callbackURL,
				requestSignUp: false,
				newUserCallbackURL,
			});
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});

	const passkeyMutation = useMutation<unknown, Error, void>({
		mutationFn: async () => {
			const { data, error } = await authClient.signIn.passkey({
				autoFill: true,
			});

			if (error) throw new Error(error.message);

			return data;
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});

	// Anonymous user
	const hasRun = useRef(false);
	const anonymousUserMutation = useMutation<unknown, Error, void>({
		mutationFn: async () => {
			await authClient.signIn.anonymous();
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: No other way to do this
	useEffect(() => {
		if (hasRun.current) return;

		hasRun.current = true;

		const run = async () => {
			try {
				// 🔑 KEY CHECK
				const { data } = await authClient.getSession();
				if (!data?.session?.id) {
					anonymousUserMutation.mutate();
				}
			} catch (err) {
				if (err instanceof Error) {
					handleError(err);
				}
			}
		};

		run();
	}, []);

	useEffect(() => {
		if (!PublicKeyCredential.isConditionalMediationAvailable?.()) {
			return;
		}

		authClient.signIn.passkey({
			autoFill: true,
		});
	}, [authClient]);

	return {
		signInWithOAuthMutation: oauthMutation,
		signInWithMagicLinkMutation: magicLinkMutation,
		signInWithSSOMutation: ssoMutation,
		signInWithPasskeyMutation: passkeyMutation,
		lastLoginMethodQuery: lastLoginQuery,
	};
}
