import { useQuery } from "@tanstack/react-query";
import { getErrorStatus } from "@zero-heads-lab/shared/utils";
import type { AuthRole, Resource } from "../access-control";
import { useAuthContext } from "../client/context";
import { determineAccessRole } from "../helpers";
import type { ActionsOf } from "../types";

export type CheckAuthorizationParams<R extends Resource = Resource> = {
	role: AuthRole;
	resource: R;
	action: ActionsOf<R>;
};

export type UseAuthorizationReturn = {
	can: boolean;
	isLoading: boolean;
	isFetching: boolean;
	error: Error | null;
	refetch: () => void;
};

/**
 * @description
 * This hook is used to check if a user has permission to perform an action on a resource.
 */
export function useAuthorization<R extends Resource>({
	role,
	resource,
	action,
}: CheckAuthorizationParams<R>): UseAuthorizationReturn {
	const accessRole = determineAccessRole(role);
	const { authClient } = useAuthContext();

	const query = useQuery({
		queryKey: ["authorization-check", accessRole, resource, action],
		queryFn: async () => {
			const { data, error } = await authClient.organization.hasPermission({
				permissions: {
					[resource]: [action],
				},
			});

			if (error) throw error;
			return Boolean(data);
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
		can: query.data ?? false,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		error: query.error,
		refetch: query.refetch,
	};
}
