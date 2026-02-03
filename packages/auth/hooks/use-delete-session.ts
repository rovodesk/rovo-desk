<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { AuthSession, MutationOptions } from "../types";

export const useDeleteSession = (options?: MutationOptions) => {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

<<<<<<< HEAD
	const mutation = useMutation({
		mutationFn: async (sessionToken: string) => {
			const { error } = await authClient.revokeSession({
				token: sessionToken,
			});
			if (error) {
				throw error;
			}
		},
=======
	const {
		mutate: deleteSession,
		isPending,
		variables,
	} = useMutation({
		mutationFn: async (sessionToken: string) =>
			authClient.revokeSession({ token: sessionToken }),
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

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
<<<<<<< HEAD
			options?.onError?.(_err);
		},

		onSuccess: () => {
			options?.onSuccess?.();
=======
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
		},
<<<<<<< HEAD
	});

	return {
		deleteSession: mutation.mutate,
		isPending: mutation.isPending,
		pendingToken: mutation.variables,
=======

		onSuccess: () => {
			options?.onSuccess?.();
		},
	});

	return {
		deleteSession,
		isPending,
		variables,
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
	};
};
