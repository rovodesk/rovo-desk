import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "../client";
import { useAuthContext } from "../client/context";

export const useAdmin = () => {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	const adminCallbackURL = keys.VITE_ADMIN_SIGN_IN_CALLBACK_URL ?? `${window.location.origin}/admin`;

	const handleSessionSync = async () => {
		await queryClient.invalidateQueries({
			queryKey: ["auth", "session"],
		});
	};

	const adminSignInMutation = useMutation({
		mutationFn: async () => {
			if (!adminCallbackURL)
				throw new Error("VITE_ADMIN_SIGN_IN_CALLBACK_URL callback URL is not defined");
			// Admin is a SAML provider
			return await authClient.signIn.social({
				provider: "cognito",
				callbackURL: adminCallbackURL
			});
		},
		onSuccess: handleSessionSync,
	});

	const isLoading = adminSignInMutation.isPending;
	const error = adminSignInMutation.error;

	return {
		adminSignInMutation: adminSignInMutation.mutate,
		adminSignInMutationAsync: adminSignInMutation.mutateAsync,

		isLoading,
		error,
	};
};
