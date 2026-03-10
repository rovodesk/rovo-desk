import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "../client";
import { useAuthContext } from "../client/context";

export const useAdmin = () => {
    const { authClient } = useAuthContext();
    const queryClient = useQueryClient();

    const adminCallbackURL = keys.VITE_ADMIN_SIGN_IN_CALLBACK_URL;

    const handleSessionSync = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["auth", "session"],
        });
    };

    const adminSignInMutation = useMutation({
        mutationFn: () => {
            if (!adminCallbackURL)
                throw new Error("Admin callback URL is not defined");
            // Admin is a SAML provider
            return authClient.signIn.social({
                provider: "cognito",
                callbackURL: adminCallbackURL,
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
