import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";

export function useLastLoginMethod(options?: UseQueryOptions<string | null>) {
	const { authClient } = useAuthContext();

	const {
		data: lastLoginMethod = null,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["auth", "last-login-method"],
		queryFn: () => authClient.getLastUsedLoginMethod(),
		...options,
	});

	return {
		lastLoginMethod,
		isLoading,
		error,
		refetch,
	};
}
