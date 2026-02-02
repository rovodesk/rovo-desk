<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
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
<<<<<<< HEAD
			authClient.multiSession.revoke({ sessionToken }),
=======
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
=======

		onSuccess: () => {
			options?.onSuccess?.();
		},
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
	});

	return {
		deleteSession,
		isPending,
<<<<<<< HEAD
		pendingToken: variables,
=======
		variables,
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
	};
};
