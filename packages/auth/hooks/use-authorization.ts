import { useQuery } from "@tanstack/react-query";
import { getErrorStatus } from "@zero-heads-lab/shared/utils";
import type { AuthRole } from "../access-control";
import { useAuthContext } from "../client/context";
import { determineAccessRole, narrowToClientPermissions } from "../helpers";
import type { AuthorizationResultMap, PermissionCheckMap } from "../types";

export function useAuthorization({
	role,
	permissions,
}: {
	role: AuthRole;
	permissions: PermissionCheckMap;
}) {
	const accessRole = determineAccessRole(role);
	const { authClient } = useAuthContext();
	const clientPermissions = narrowToClientPermissions(permissions);

	const query = useQuery({
		queryKey: ["authorization-map", accessRole, permissions],
		queryFn: () => {
			const canPerform = authClient.organization.checkRolePermission({
				role: accessRole,
				// biome-ignore lint/suspicious/noExplicitAny: Strongly typed permissions map is not inferable
				permissions: clientPermissions as any,
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
		enabled: accessRole !== "anonymous",
		staleTime: 60_000,
		retry: (failureCount, error) => {
			const status = getErrorStatus(error);
			if (status === 401 || status === 403) return false;
			return failureCount < 2;
		},
	});

	return {
		permissions: query.data ?? {},
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		error: query.error,
		refetch: query.refetch,
	};
}
