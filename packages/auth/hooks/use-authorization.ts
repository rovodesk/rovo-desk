import { useQuery } from "@tanstack/react-query";
import { getErrorStatus } from "@zero-heads-lab/shared/utils";
import { useAuthContext } from "../client/context";
import { narrowToClientPermissions } from "../helpers";
import type { AuthorizationResultMap, PermissionCheckMap } from "../types";

export function useAuthorization({
	permissions,
}: {
	permissions: PermissionCheckMap;
}) {
	const { authClient } = useAuthContext();
	const clientPermissions = narrowToClientPermissions(permissions);

	const query = useQuery({
		queryKey: ["authorization-map", permissions],
		queryFn: () => {
			const canPerform = authClient.organization.hasPermission({
				permissions: clientPermissions,
			});
			/**
			 * Normalize Better Auth response into:
			 * { "resource:action": boolean }
			 */
			const result: AuthorizationResultMap = {};

			for (const [resource, actions] of Object.entries(permissions)) {
				for (const action of actions ?? []) {
					const resourcePermissions = (
						canPerform as unknown as Record<string, string[]>
					)?.[resource];

					const hasPermission = Array.isArray(resourcePermissions)
						? resourcePermissions.includes(action)
						: Boolean(resourcePermissions?.[action]);

					result[`${resource}:${action}`] = hasPermission;
				}
			}

			return result;
		},
		enabled: Object.keys(permissions).length > 0,
		staleTime: 60_000,
		retry: (failureCount, error) => {
			const status = getErrorStatus(error);
			if (status === 401 || status === 403) return false;
			return failureCount < 2;
		},
	});

	const loading = query.isLoading || query.isFetching;

	return {
		permissions: query.data ?? {},
		loading,
		error: query.error,
		refetch: query.refetch,
	};
}
