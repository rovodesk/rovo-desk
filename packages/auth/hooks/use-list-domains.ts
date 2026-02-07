<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client"

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";

export function useListDomains(options?: QueryOptions) {
	const { authClient } = useAuthContext();

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["auth", "domains"],
		queryFn: async () => {
			const res = (await authClient.organization.list()).data;
			return res ?? [];
		},

		...options,
	});

	return {
		domains: Array.isArray(data) ? data : [],
		isLoading,
		error,
		refetch,
	};
}
