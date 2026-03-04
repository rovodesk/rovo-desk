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
	updateWorkspaceSettingsOptions?: UpdateWorkspaceSettingsMutationOptions,
	clearOnboardingProgressOptions?: clearOnboardingProgressMutationOptions,
	persistOnboardingProgressOptions?: PersistOnboardingProgressMutationOptions
) {
	const queryClient = useQueryClient();
	const { session, loading: isSessionLoading } = useSession();

	/*
	 * Base query options (computed once)
	 */
	const baseQueryOptions = orpcQuery.profile.onboarding.load.queryOptions({
		enabled: Boolean(session?.user?.id) && !isSessionLoading,
	});

	/*
	 * QUERY
	 */
	const onboardingProgressQuery = useQuery({
		...baseQueryOptions,
		...onboardingProgressQueryOptions,
	});

	const workspaceProfileQuery = useQuery({
		...orpcQuery.profile.workspace.get.queryOptions({
			enabled: Boolean(session?.user?.id) && !isSessionLoading,
		}),
		...workspaceProfileQueryOptions,
	});

	/*
	 * PERSIST MUTATION
	 */
	const persistOnboardingProgressMutation = useMutation({
		...orpcQuery.profile.onboarding.persist.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: baseQueryOptions.queryKey,
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
					queryKey: baseQueryOptions.queryKey,
				});
			},
		}),
		...clearOnboardingProgressOptions,
	});

	const updateWorkspaceSettingsMutation = useMutation({
		...orpcQuery.profile.workspace.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: baseQueryOptions.queryKey,
				});
			},
		}),
		...updateWorkspaceSettingsOptions,
	});

	const loading =
		onboardingProgressQuery.isLoading ||
		workspaceProfileQuery.isLoading ||
		isSessionLoading ||
		persistOnboardingProgressMutation.isPending ||
		clearOnboardingProgressMutation.isPending ||
		updateWorkspaceSettingsMutation.isPending;

	return {
		onboardingProgress: onboardingProgressQuery.data,
		workspaceProfile: workspaceProfileQuery.data,
		loading,

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

		refetch: () => {
			onboardingProgressQuery.refetch();
			workspaceProfileQuery.refetch();
		},
	};
}
