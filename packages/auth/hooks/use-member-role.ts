<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client"

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

import type { QueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthContext } from "../client/context";
import { useSession } from "./use-session";

export function useMemberRole(orgId?: string, options?: QueryOptions) {
	const { authClient } = useAuthContext();

	const { session } = useSession();

	const memoizedOrgId = useMemo(
		() => orgId ?? session?.session.activeOrganizationId,
		[session, orgId]
	);

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["auth", "member", "role", memoizedOrgId],
		queryFn: async () => {
			if (!memoizedOrgId) return null;
			return (
				await authClient.organization.getActiveMemberRole({
					query: { organizationId: memoizedOrgId },
				})
			).data;
		},
		...options,
	});

	return {
		memberRole: data ?? null,
		isLoading,
		error,
		refetch,
	};
}
