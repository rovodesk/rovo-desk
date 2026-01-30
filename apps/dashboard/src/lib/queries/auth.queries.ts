import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@zero-heads-lab/auth/client";

export const authQueries = {
	session: () =>
		queryOptions({
			queryKey: ["auth", "session"],
			queryFn: async () => (await authClient.getSession()).data,
			staleTime: 60_000,
		}),
	sessionList: () =>
		queryOptions({
			queryKey: ["auth", "sessions", "list"],
			queryFn: async () => (await authClient.listSessions()).data,
			staleTime: 60_000,
		}),

	orgList: () =>
		queryOptions({
			queryKey: ["auth", "organizations"],
			queryFn: async () => (await authClient.organization.list()).data,
			staleTime: 60_000,
		}),

	activeOrg: (orgId?: string) =>
		queryOptions({
			queryKey: ["auth", "organization", orgId],
			queryFn: async () => {
				if (!orgId) return null;
				return (
					await authClient.organization.getFullOrganization({
						query: { organizationId: orgId },
					})
				).data;
			},
			enabled: !!orgId,
			staleTime: 60_000,
		}),

	teamsList: (teamId?: string) =>
		queryOptions({
			queryKey: ["auth", "teams", teamId],
			queryFn: async () => {
				if (!teamId) return [];
				return (await authClient.organization.listTeams()).data;
			},
			enabled: !!teamId,
			staleTime: 60_000,
		}),

	memberRole: (orgId?: string) =>
		queryOptions({
			queryKey: ["auth", "organization", "member", "role", orgId],
			queryFn: async () => {
				if (!orgId) return null;
				return (
					await authClient.organization.getActiveMemberRole({
						query: { organizationId: orgId },
					})
				).data;
			},
			enabled: !!orgId,
			staleTime: 60_000,
		}),
};
