import { useQuery } from "@tanstack/react-query";
import type { UserData } from "@/types/auth";
import { useAuth } from "./use-auth";

export const useUser = () => {
	const { user, isLoading, isAuthenticated } = useAuth();

	return useQuery<UserData | null>({
		queryKey: ["identity"],
		queryFn: () => user ?? null,
		enabled: isAuthenticated && !isLoading,
		staleTime: Number.POSITIVE_INFINITY,
		initialData: null,
	});
};
