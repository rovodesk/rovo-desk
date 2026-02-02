<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthContext } from "../client/context";
import { useSession } from "./use-session";

export function useListTeams(teamId?: string, options?: QueryOptions) {
	const { authClient } = useAuthContext();

	const { session } = useSession();

	const memoizedTeamId = useMemo(
		() => teamId ?? session?.session.activeOrganizationId,
		[session, teamId]
	);

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["auth", "teams"],
		queryFn: async () => {
			const res = (
				await authClient.organization.list({
					query: { organizationId: memoizedTeamId },
				})
			).data;
			return res ?? [];
		},

		...options,
	});

	return {
		teams: Array.isArray(data) ? data : [],
		isLoading,
		error,
		refetch,
	};
}
