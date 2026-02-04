import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { AuthSession, MutationOptions } from "../types";

export const useDeleteSession = (options?: MutationOptions) => {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	const {
		mutate: deleteSession,
		isPending,
		variables,
	} = useMutation({
		mutationFn: async (sessionToken: string) =>
			authClient.multiSession.revoke({ sessionToken }),

		onMutate: async (sessionToken) => {
			await queryClient.cancelQueries({ queryKey: ["auth", "sessions"] });

			const previousSessions = queryClient.getQueryData<AuthSession[]>([
				"auth",
				"sessions",
			]);

			queryClient.setQueryData<AuthSession[]>(["auth", "sessions"], (old) =>
				old?.filter((s) => s.token !== sessionToken)
			);

			return { previousSessions };
		},

		onError: (_err, _token, context) => {
			if (context?.previousSessions) {
				queryClient.setQueryData(
					["auth", "sessions"],
					context.previousSessions
				);
			}
			options?.onError?.(_err);
		},

		onSuccess: () => {
			options?.onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
		},
	});

	return {
		deleteSession,
		isPending,
		pendingToken: variables,
	};
};
