import { type QueryOptions, useQuery } from "@tanstack/react-query";
import type { AuthUser } from "@zero-heads-lab/auth/types";
import { getErrorStatus, Placeholder } from "@zero-heads-lab/shared/utils";
import { useAuthContext } from "../client/context";

export function useUser(options?: QueryOptions<AuthUser | null>) {
	const { authClient } = useAuthContext();

	const { data, isLoading, error, refetch } = useQuery<AuthUser | null>({
		queryKey: ["auth", "session", "user"],
		queryFn: async () => {
			const res = await authClient.getSession();
			return res?.data?.user ?? null;
		},

		// ❌ Don’t retry on auth failures
		retry: (failureCount, error) => {
			const status = getErrorStatus(error);
			if (status === 401 || status === 403) return false;
			return failureCount < 2;
		},
		...options,
	});

	return {
		user: {
			...data,
			name: data?.name ?? Placeholder.name(2, "-").toLowerCase(),
			image: data?.image ?? Placeholder.avatar(data?.email),
		} as AuthUser,
		isLoading,
		isAuthenticated: Boolean(data),
		error,
		refetch,
	};
}
