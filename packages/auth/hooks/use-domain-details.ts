<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { getErrorStatus } from "@zero-heads-lab/shared/utils";
import { useMemo } from "react";
import { useAuthContext } from "../client/context";
import type { AuthClient } from "../types";
import { useSession } from "./use-session";

type FullOrganization = Awaited<
	ReturnType<AuthClient["organization"]["getFullOrganization"]>
>["data"];

export function useDomainDetails(
	domainId?: string,
	options?: QueryOptions<FullOrganization | null>
) {
	const { authClient } = useAuthContext();

	const { session } = useSession();

	const memoizedDomainId = useMemo(
		() => domainId ?? session?.session.activeOrganizationId,
		[session, domainId]
	);

	const { data, isLoading, error, refetch } = useQuery<FullOrganization | null>(
		{
			queryKey: ["auth", "domain", memoizedDomainId],
			queryFn: async () => {
				if (!memoizedDomainId) return null;
				const { data } = await authClient.organization.getFullOrganization({
					query: { organizationId: memoizedDomainId },
				});

				return data;
			},
			enabled: !!memoizedDomainId,
			...options,
			retry: (failureCount, error) => {
				const status = getErrorStatus(error);
				if (status === 404 || status === 405) return false;
				return failureCount < 2;
			},
		}
	);

	return {
		domain: data ?? null,
		isEnabled: !!memoizedDomainId,
		isLoading,
		error,
		refetch,
	};
}
