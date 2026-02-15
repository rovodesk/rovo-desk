import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { orpcQuery } from "@zero-heads-lab/transport/client";

/*
 * TYPES
 */
type OnboardingData = Awaited<
	ReturnType<typeof orpcQuery.profile.onboarding.load.call>
>;

type PersistInput = Parameters<
	typeof orpcQuery.profile.onboarding.persist.call
>[0];

/*
 * HOOK
 */
export function useOnboardingProgress(
	queryOptions?: Omit<UseQueryOptions<OnboardingData>, "queryKey" | "queryFn">,
	persistOptions?: Omit<
		UseMutationOptions<
			Awaited<ReturnType<typeof orpcQuery.profile.onboarding.persist.call>>,
			Error,
			PersistInput
		>,
		"mutationFn"
	>,
	clearOptions?: Omit<
		UseMutationOptions<
			Awaited<ReturnType<typeof orpcQuery.profile.onboarding.clear.call>>,
			Error
		>,
		"mutationFn"
	>
) {
	const queryClient = useQueryClient();
	const { session, isLoading: isSessionLoading } = useSession();

	/*
	 * Base query options (computed once)
	 */
	const baseQueryOptions = orpcQuery.profile.onboarding.load.queryOptions({
		enabled: Boolean(session?.user?.id) && !isSessionLoading,
	});

	/*
	 * QUERY
	 */
	const query = useQuery({
		...baseQueryOptions,
		...queryOptions,
	});

	/*
	 * PERSIST MUTATION
	 */
	const persistMutation = useMutation({
		...orpcQuery.profile.onboarding.persist.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: baseQueryOptions.queryKey,
				});
			},
		}),
		...persistOptions,
	});

	/*
	 * CLEAR MUTATION
	 */
	const clearMutation = useMutation({
		...orpcQuery.profile.onboarding.clear.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: baseQueryOptions.queryKey,
				});
			},
		}),
		...clearOptions,
	});

	return {
		onboardingProgress: query.data,
		isLoading: query.isLoading || isSessionLoading,

		// Persist
		persistOnboardingProgress: persistMutation.mutate,
		persistAsync: persistMutation.mutateAsync,
		isPersisting: persistMutation.isPending,

		// Clear
		clearOnboardingProgress: clearMutation.mutate,
		clearAsync: clearMutation.mutateAsync,
		isClearing: clearMutation.isPending,

		refetch: query.refetch,
	};
}
