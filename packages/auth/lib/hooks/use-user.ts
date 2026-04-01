import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import type { UserProfile } from "@kinde-oss/kinde-auth-react/utils";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
	const { user, isLoading, isAuthenticated } = useKindeAuth();

	return useQuery<UserProfile | undefined>({
		queryKey: ["identity"],
		queryFn: () => user,
		enabled: isAuthenticated && !isLoading,
		staleTime: Number.POSITIVE_INFINITY,
		initialData: undefined,
	});
};
