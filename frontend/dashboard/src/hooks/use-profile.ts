// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useOrganization, useUser } from "@zero-heads-lab/auth/hooks";
// import { orpcQuery, type RPCOutputs } from "@/lib/orpc-client";

// type WorkspaceProfileOutput =
// 	RPCOutputs["profile"]["workspace"]["getWorkspaceProfile"];

// type OnboardingProgressOutput =
// 	RPCOutputs["profile"]["onboarding"]["loadProgress"];

// type UserProfileOutput = RPCOutputs["profile"]["user"]["getUserProfile"];

// export function useProfile() {
// 	const queryClient = useQueryClient();
// 	const { data: user, isLoading: isSessionLoading } = useUser();
// 	const { data: workspace } = useOrganization();

// 	const userId = user?.id;
// 	const onboardingQueryOptions =
// 		orpcQuery.profile.onboarding.loadProgress.queryOptions({
// 			enabled: Boolean(userId) && !isSessionLoading,
// 			queryKey: ["profile", userId],
// 		});

// 	const workspaceId = workspace?.currentOrganization;
// 	const workspaceQueryOptions =
// 		orpcQuery.profile.workspace.getWorkspaceProfile.queryOptions({
// 			enabled: Boolean(workspaceId) && !isSessionLoading,
// 			queryKey: ["profile", workspaceId],
// 		});

// 	const userQueryOptions = orpcQuery.profile.user.getUserProfile.queryOptions({
// 		enabled: Boolean(userId) && !isSessionLoading,
// 		queryKey: ["profile", userId],
// 	});

// 	/*
// 	 * QUERY
// 	 */
// 	const onboardingProgressQuery = useQuery<OnboardingProgressOutput>({
// 		...onboardingQueryOptions,
// 	});

// 	const workspaceProfileQuery = useQuery<WorkspaceProfileOutput>({
// 		...workspaceQueryOptions,
// 	});

// 	const userProfileQuery = useQuery<UserProfileOutput>({
// 		...userQueryOptions,
// 	});

// 	/*
// 	 * PERSIST MUTATION
// 	 */
// 	const persistOnboardingProgressMutation = useMutation({
// 		...orpcQuery.profile.onboarding.persistProgress.mutationOptions({
// 			onSuccess: () => {
// 				queryClient.invalidateQueries({
// 					queryKey: onboardingQueryOptions.queryKey,
// 				});
// 			},
// 		}),
// 	});

// 	const updateWorkspaceSettingsMutation = useMutation({
// 		...orpcQuery.profile.workspace.updateWorkspaceSettings.mutationOptions({
// 			onMutate: async (variables) => {
// 				await queryClient.cancelQueries({
// 					queryKey: workspaceQueryOptions.queryKey,
// 				});

// 				const previous = queryClient.getQueryData(
// 					workspaceQueryOptions.queryKey
// 				);

// 				queryClient.setQueryData(
// 					workspaceQueryOptions.queryKey,
// 					(old: WorkspaceProfileOutput) => ({
// 						...old,
// 						settings: variables.settings,
// 					})
// 				);

// 				return { previous };
// 			},
// 			onError: (_err, _vars, context) => {
// 				queryClient.setQueryData(
// 					workspaceQueryOptions.queryKey,
// 					context?.previous
// 				);
// 			},
// 			onSettled: () => {
// 				queryClient.invalidateQueries({
// 					queryKey: workspaceQueryOptions.queryKey,
// 				});
// 			},
// 		}),
// 	});

// 	const toggleUserActiveMutation = useMutation({
// 		...orpcQuery.profile.user.toggleUserActive.mutationOptions({
// 			onMutate: async (variables) => {
// 				await queryClient.cancelQueries({
// 					queryKey: userQueryOptions.queryKey,
// 				});

// 				const previous = queryClient.getQueryData(userQueryOptions.queryKey);

// 				queryClient.setQueryData(userQueryOptions.queryKey, () => ({
// 					isActive: variables.active,
// 				}));

// 				return { previous };
// 			},
// 			onError: (_err, _vars, context) => {
// 				queryClient.setQueryData(userQueryOptions.queryKey, context?.previous);
// 			},
// 			onSettled: () => {
// 				queryClient.invalidateQueries({
// 					queryKey: userQueryOptions.queryKey,
// 				});
// 			},
// 		}),
// 	});

// 	return {
// 		onboardingProgressQuery,
// 		workspaceProfileQuery,
// 		userProfileQuery,
// 		persistOnboardingProgressMutation,
// 		updateWorkspaceSettingsMutation,
// 		toggleUserActiveMutation,
// 	};
// }
