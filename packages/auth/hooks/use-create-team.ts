<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client"

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { MutationOptions } from "../types";

export const useCreateTeam = (options?: MutationOptions) => {
	const queryClient = useQueryClient();
	const { authClient } = useAuthContext();

	const {
		mutate: createTeam,
		isPending,
		variables,
	} = useMutation({
		mutationFn: async ({ name }: { name: string }) => {
			const { data, error } = await authClient.organization.createTeam({
				name,
			});
			if (error) throw error;
			return data;
		},
		onSuccess: (res, variables) => {
			queryClient.setQueriesData(
				{ queryKey: ["auth", "teams"] },
				(old: [] = []) => [...old, res]
			);

			options?.onSuccess?.(variables);
		},
		onError: (error) => {
			console.error("Failed to create team:", error);
			options?.onError?.(error);
		},
	});

	return {
		createTeam,
		isPending,
		variables,
	};
};
