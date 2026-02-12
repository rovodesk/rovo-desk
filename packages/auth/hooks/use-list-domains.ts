import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import { useSession } from "./use-session";

export function useListDomains(userId?: string, options?: QueryOptions) {
	const { authClient } = useAuthContext();
	const { session } = useSession();

	const id: string | undefined = userId ?? session?.user?.id;

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["auth", "domains", id],
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
