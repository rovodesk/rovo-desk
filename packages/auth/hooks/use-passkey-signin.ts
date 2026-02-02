"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthContext } from "../client/context";
import type { MutationOptions } from "../types";

export const usePasskeySignIn = (options?: MutationOptions) => {
	const { authClient } = useAuthContext();

	const { mutate: signInWithPasskey, isPending } = useMutation({
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
			// BetterAuth usually handles session persistence;
			// a hard redirect ensures the auth state is synced globally.
			window.location.href = "/";
		},
		onError: (error: Error) => {
			// Check if user cancelled to avoid "scary" error toasts on cancel
			if (
				error.message.includes("User cancelled") ||
				error.message.includes("abort")
			) {
				return;
			}

			options?.onError?.(error);
		},
	});

	useEffect(() => {
		if (!PublicKeyCredential.isConditionalMediationAvailable?.()) {
			return;
		}

		authClient.signIn.passkey({ autoFill: true });
	}, [authClient]);

	return {
		signInWithPasskey,
		isPending,
	};
};
