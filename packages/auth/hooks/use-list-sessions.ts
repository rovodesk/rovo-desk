import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";

export function useListSessions(options?: QueryOptions) {
	const { authClient } = useAuthContext();

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["auth", "sessions"],
		queryFn: async () => {
			const res = (await authClient.multiSession.listDeviceSessions()).data;
			return res ?? [];
		},

		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 30, // 30 minutes

		refetchInterval: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: false,
		...options,
	});

	return {
		sessions: Array.isArray(data) ? data : [],
		isLoading,
		error,
		refetch,
	};
}
