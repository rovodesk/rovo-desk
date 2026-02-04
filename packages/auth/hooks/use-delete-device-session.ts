import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { AuthSession, MutationOptions } from "../types";

export const useDeleteDeviceSession = (options?: MutationOptions) => {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (sessionToken: string) => {
			const { error } = await authClient.multiSession.revoke({ sessionToken });
			if (error) {
				throw error;
			}
		},

		onMutate: async (sessionToken) => {
			await queryClient.cancelQueries({
				queryKey: ["auth", "device-sessions"],
			});

			const previousSessions = queryClient.getQueryData<AuthSession[]>([
				"auth",
				"device-sessions",
			]);

			queryClient.setQueryData<AuthSession[]>(
				["auth", "device-sessions"],
				(old) => old?.filter((s) => s.token !== sessionToken)
			);

			return { previousSessions };
		},

		onError: (_err, _token, context) => {
			if (context?.previousSessions) {
				queryClient.setQueryData(
					["auth", "device-sessions"],
					context.previousSessions
				);
			}
			options?.onError?.(_err);
		},

		onSuccess: () => {
			options?.onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["auth", "device-sessions"] });
		},
	});

	return {
		deleteSession: mutation.mutate,
		isPending: mutation.isPending,
		pendingToken: mutation.variables,
	};
};
