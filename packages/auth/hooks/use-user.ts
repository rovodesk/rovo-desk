import {
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { AuthUser } from "@zero-heads-lab/auth/types";
import { getErrorStatus, Placeholder } from "@zero-heads-lab/shared/utils";
import { useAuthContext } from "../client/context";

export function useUser(
	options?: UseQueryOptions<AuthUser | null>
) {
	const { authClient, replace } = useAuthContext();
	const queryClient = useQueryClient();

	const queryKey = ["auth", "session", "user"];

	const { data, isLoading: isUserLoading } = useQuery<AuthUser | null>({
		queryKey,
		queryFn: async () => {
			const res = await authClient.getSession();
			return res?.data?.user ?? null;
		},

		// ❌ Don’t retry auth failures
		retry: (failureCount, error) => {
			const status = getErrorStatus(error);
			if (status === 401 || status === 403) return false;
			return failureCount < 2;
		},

		...options,
	});

	const deleteUserMutation = useMutation({
		mutationFn: async (callbackUrl: string) => {
			await authClient.deleteUser({
				callbackURL: callbackUrl,
			});

			return callbackUrl;
		},

		onMutate: async () => {
			await queryClient.cancelQueries();
		},

		onSuccess: (callbackUrl) => {
			// Clear cached auth state
			queryClient.cancelQueries()
			queryClient.clear();

			replace(callbackUrl);
		},

		onError: (error: Error) => {
			console.error("Error deleting user", error);
		},
	});

	const isLoading = isUserLoading || deleteUserMutation.isPending;

	const user: AuthUser | null = data
		? {
			...data,
			name: data.name ?? Placeholder.name(2, "-").toLowerCase(),
			image: data.image ?? Placeholder.avatar(data.email),
		}
		: null;

	return {
		user,
		isLoading,
		isAuthenticated: Boolean(user),

		deleteUser: deleteUserMutation.mutate,
		deleteUserAsync: deleteUserMutation.mutateAsync,
	};
}