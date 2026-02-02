"use client";

import { type QueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthContext } from "../client/context";
import { useSession } from "./use-session";

export function useCustomerSubscription(
	organizationId?: string,
	options?: QueryOptions,
	pagination?: {
		page?: number;
		limit?: number;
	},
	active?: boolean
) {
	const { authClient } = useAuthContext();

	const { session } = useSession();

	const memoizedOrganizationId = useMemo(
		() => organizationId ?? session?.session.activeOrganizationId,
		[session, organizationId]
	);

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["auth", "teams"],
		queryFn: async () => {
			const res = (
				await authClient.customer.subscriptions.list({
					query: {
						page: pagination?.page,
						limit: pagination?.limit,
						active,
						productBillingType: "recurring",
						referenceId: memoizedOrganizationId,
					},
				})
			).data;
			return res ?? [];
		},

		...options,
	});

	return {
		subscriptions: Array.isArray(data) ? data : [],
		isLoading,
		error,
		refetch,
	};
}
