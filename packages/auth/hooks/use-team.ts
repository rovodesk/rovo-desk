import {
	type QueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthContext } from "../client/context";
import type { MutationOptions, Team } from "../types";
import { useSession } from "./use-session";

type UseTeamOptions = {
	queryOptions?: QueryOptions<Team[]>;
	mutationOptions?: MutationOptions;
};

export function useTeam(options?: UseTeamOptions) {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();
	const { session } = useSession();

	const organizationId = session?.session.activeOrganizationId;

	/* ================================================= */
	/* =================== LIST TEAMS ================== */
	/* ================================================= */

	const teamsQuery = useQuery({
		queryKey: ["auth", "teams", organizationId],
		queryFn: async () => {
			if (!organizationId) return [];

			const res = (
				await authClient.organization.list({
					query: { organizationId },
				})
			).data;

			return res ?? [];
		},
		enabled: Boolean(organizationId),
		...options?.queryOptions,
	});

	/* ================================================= */
	/* ================= CREATE TEAM =================== */
	/* ================================================= */

	const createTeamMutation = useMutation({
		mutationFn: async ({ name }: { name: string }) => {
			const { data, error } = await authClient.organization.createTeam({
				name,
			});
			if (error) throw error;
			return data;
		},

		onSuccess: async (newTeam, variables) => {
			// Optimistically update teams cache
			queryClient.setQueryData(
				["auth", "teams", organizationId],
				(old: Team[] = []) => [...old, newTeam]
			);

			// Set active team
			await authClient.organization.setActiveTeam({
				teamId: newTeam.id,
			});

			options?.mutationOptions?.onSuccess?.(variables);
		},

		onError: (error) => {
			console.error("Failed to create team:", error);
			options?.mutationOptions?.onError?.(error);
		},
	});

	/* ================================================= */
	/* ================= UNIFIED STATE ================= */
	/* ================================================= */

	const loading = teamsQuery.isLoading || createTeamMutation.isPending;

	const error = teamsQuery.error || createTeamMutation.error || null;

	const refetch = teamsQuery.refetch;

	return useMemo(
		() => ({
			// Data
			teams: teamsQuery.data ?? [],
			activeTeamId: session?.session.activeTeamId ?? null,

			// Actions
			createTeam: createTeamMutation.mutate,
			createTeamAsync: createTeamMutation.mutateAsync,

			// Unified state
			loading,
			error,
			refetch,
		}),
		[
			teamsQuery.data,
			session?.session.activeTeamId,
			createTeamMutation.mutate,
			createTeamMutation.mutateAsync,
			loading,
			error,
			refetch,
		]
	);
}
