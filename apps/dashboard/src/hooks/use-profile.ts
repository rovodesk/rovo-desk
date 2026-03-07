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

type UpdateWorkspaceSettingsInput = Parameters<
	typeof orpcQuery.profile.workspace.update.call
>[0];

type UpdateWorkspaceSettingsMutationOptions = Omit<
	UseMutationOptions<
		Awaited<ReturnType<typeof orpcQuery.profile.workspace.update.call>>,
		Error,
		UpdateWorkspaceSettingsInput
	>,
	"mutationFn"
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

type ToggleUserAwayInput = Parameters<
	typeof orpcQuery.profile.user.toggleAway.call
>[0];

type ToggleUserAwayMutationOptions = Omit<
	UseMutationOptions<
		Awaited<ReturnType<typeof orpcQuery.profile.user.toggleAway.call>>,
		Error,
		ToggleUserAwayInput
	>,
	"mutationFn"
>;

export function useProfile(
	workspaceProfileQueryOptions?: WorkspaceProfileQueryOptions,
	onboardingProgressQueryOptions?: OnboardingProgressQueryOptions,
	updateWorkspaceSettingsOptions?: UpdateWorkspaceSettingsMutationOptions,
	clearOnboardingProgressOptions?: clearOnboardingProgressMutationOptions,
	persistOnboardingProgressOptions?: PersistOnboardingProgressMutationOptions,
	toggleUserAwayOptions?: ToggleUserAwayMutationOptions,
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
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: workspaceQueryOptions.queryKey,
				});
			},
		}),
		...updateWorkspaceSettingsOptions,
	});

	const toggleUserAwayMutation = useMutation({
		...orpcQuery.profile.user.toggleAway.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: userQueryOptions.queryKey,
				});
			},
		}),
		...toggleUserAwayOptions,
	});

	const loading =
		onboardingProgressQuery.isLoading ||
		workspaceProfileQuery.isLoading ||
		isSessionLoading ||
		persistOnboardingProgressMutation.isPending ||
		clearOnboardingProgressMutation.isPending ||
		updateWorkspaceSettingsMutation.isPending ||
		toggleUserAwayMutation.isPending ||
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

		// Toggle User Away
		toggleUserAway: toggleUserAwayMutation.mutate,
		toggleUserAwayAsync: toggleUserAwayMutation.mutateAsync,

		refetch: () => {
			onboardingProgressQuery.refetch();
			workspaceProfileQuery.refetch();
			userProfileQuery.refetch();
		},
	};
}
