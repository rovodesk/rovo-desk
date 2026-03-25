import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { orpcQuery } from "@zero-heads-lab/transport/client";

type OnboardingData = Awaited<
	ReturnType<typeof orpcQuery.profile.onboarding.load.call>
>;

type PersistInput = Parameters<
	typeof orpcQuery.profile.onboarding.persist.call
>[0];

type WorkspaceProfileData = Awaited<
	ReturnType<typeof orpcQuery.profile.workspace.get.call>
>;

type clearOnboardingProgressMutationOptions = Omit<
	UseMutationOptions<
		Awaited<ReturnType<typeof orpcQuery.profile.onboarding.clear.call>>,
		Error
	>,
	"mutationFn"
>;

type WorkspaceProfileQueryOptions = Omit<
	UseQueryOptions<WorkspaceProfileData>,
	"queryKey" | "queryFn"
>;

type OnboardingProgressQueryOptions = Omit<
	UseQueryOptions<OnboardingData>,
	"queryKey" | "queryFn"
>;

type UserProfileData = Awaited<
	ReturnType<typeof orpcQuery.profile.user.get.call>
>;

type UserProfileQueryOptions = Omit<
	UseQueryOptions<UserProfileData>,
	"queryKey" | "queryFn"
>;

type PersistOnboardingProgressMutationOptions = Omit<
	UseMutationOptions<
		Awaited<ReturnType<typeof orpcQuery.profile.onboarding.persist.call>>,
		Error,
		PersistInput
	>,
	"mutationFn"
>;

export function useProfile(
	workspaceProfileQueryOptions?: WorkspaceProfileQueryOptions,
	onboardingProgressQueryOptions?: OnboardingProgressQueryOptions,
	clearOnboardingProgressOptions?: clearOnboardingProgressMutationOptions,
	persistOnboardingProgressOptions?: PersistOnboardingProgressMutationOptions,
	userProfileQueryOptions?: UserProfileQueryOptions
) {
	const queryClient = useQueryClient();
	const { session, loading: isSessionLoading } = useSession();

	const userId = session?.user?.id;
	const onboardingQueryOptions = orpcQuery.profile.onboarding.load.queryOptions(
		{
			enabled: Boolean(userId) && !isSessionLoading,
			queryKey: ["profile", userId],
		}
	);

	const workspaceId = session?.session?.activeOrganizationId;
	const workspaceQueryOptions = orpcQuery.profile.workspace.get.queryOptions({
		enabled: Boolean(workspaceId) && !isSessionLoading,
		queryKey: ["profile", workspaceId],
	});

	const userQueryOptions = orpcQuery.profile.user.get.queryOptions({
		enabled: Boolean(userId) && !isSessionLoading,
		queryKey: ["profile", userId],
	});

	/*
	 * QUERY
	 */
	const onboardingProgressQuery = useQuery({
		...onboardingQueryOptions,
		...onboardingProgressQueryOptions,
	});

	const workspaceProfileQuery = useQuery({
		...workspaceQueryOptions,
		...workspaceProfileQueryOptions,
	});

	const userProfileQuery = useQuery({
		...userQueryOptions,
		...userProfileQueryOptions,
	});

	/*
	 * PERSIST MUTATION
	 */
	const persistOnboardingProgressMutation = useMutation({
		...orpcQuery.profile.onboarding.persist.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: onboardingQueryOptions.queryKey,
				});
			},
		}),
		...persistOnboardingProgressOptions,
	});

	/*
	 * CLEAR MUTATION
	 */
	const clearOnboardingProgressMutation = useMutation({
		...orpcQuery.profile.onboarding.clear.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: onboardingQueryOptions.queryKey,
				});
			},
		}),
		...clearOnboardingProgressOptions,
	});

	const updateWorkspaceSettingsMutation = useMutation({
		...orpcQuery.profile.workspace.update.mutationOptions({
			onMutate: async (variables) => {
				await queryClient.cancelQueries({
					queryKey: workspaceQueryOptions.queryKey,
				});

				const previous = queryClient.getQueryData(
					workspaceQueryOptions.queryKey
				);

				queryClient.setQueryData(
					workspaceQueryOptions.queryKey,
					(old: WorkspaceProfileData) => ({
						...old,
						settings: variables.settings,
					})
				);

				return { previous };
			},
			onError: (_err, _vars, context) => {
				queryClient.setQueryData(
					workspaceQueryOptions.queryKey,
					context?.previous
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: workspaceQueryOptions.queryKey,
				});
			},
		}),
	});

	const toggleUserActiveMutation = useMutation({
		...orpcQuery.profile.user.toggleActive.mutationOptions({
			onMutate: async (variables) => {
				await queryClient.cancelQueries({
					queryKey: userQueryOptions.queryKey,
				});

				const previous = queryClient.getQueryData(userQueryOptions.queryKey);

				queryClient.setQueryData(
					userQueryOptions.queryKey,
					(old: UserProfileData) => ({
						...old,
						isActive: variables.active,
					})
				);

				return { previous };
			},
			onError: (_err, _vars, context) => {
				queryClient.setQueryData(userQueryOptions.queryKey, context?.previous);
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: userQueryOptions.queryKey,
				});
			},
		}),
	});

	const loading =
		onboardingProgressQuery.isLoading ||
		workspaceProfileQuery.isLoading ||
		isSessionLoading ||
		persistOnboardingProgressMutation.isPending ||
		clearOnboardingProgressMutation.isPending ||
		updateWorkspaceSettingsMutation.isPending ||
		toggleUserActiveMutation.isPending ||
		userProfileQuery.isLoading;

	return {
		onboardingProgress: onboardingProgressQuery.data,
		workspaceProfile: workspaceProfileQuery.data,
		userProfile: userProfileQuery.data,
		isLoading: loading,

		// Persist
		persistOnboardingProgressMutation: persistOnboardingProgressMutation.mutate,
		persistOnboardingProgressMutationAsync:
			persistOnboardingProgressMutation.mutateAsync,

		// Clear
		clearOnboardingProgressMutation: clearOnboardingProgressMutation.mutate,
		clearOnboardingProgressMutationAsync:
			clearOnboardingProgressMutation.mutateAsync,

		// Update Workspace Settings
		updateWorkspaceSettings: updateWorkspaceSettingsMutation.mutate,
		updateWorkspaceSettingsAsync: updateWorkspaceSettingsMutation.mutateAsync,

		// Toggle User Active
		toggleUserActive: toggleUserActiveMutation.mutate,
		toggleUserActiveAsync: toggleUserActiveMutation.mutateAsync,

		refetch: () => {
			onboardingProgressQuery.refetch();
			workspaceProfileQuery.refetch();
			userProfileQuery.refetch();
		},
	};
}
