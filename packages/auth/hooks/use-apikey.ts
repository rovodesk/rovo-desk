import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorStatus } from "@zero-heads-lab/shared/utils";
import { useAuthContext } from "../client/context";
import { useSession } from "./use-session";

export const API_KEYS_QUERY_KEY = ["auth", "api-keys"];

export function useApiKeys() {
	const { authClient } = useAuthContext();
	const { session, loading: isSessionLoading } = useSession();

	const queryClient = useQueryClient();

	const enabled =
		Boolean(session?.session?.activeOrganizationId) && !isSessionLoading;

	const getApiKeyQueryOptions = (keyId: string, configId?: string) => ({
		queryKey: [...API_KEYS_QUERY_KEY, keyId, configId],
		queryFn: async () => {
			const res = await authClient.apiKey.get({
				query: {
					id: keyId,
				},
			});
			return res?.data ?? null;
		},
		enabled,
	});

	const listQuery = useQuery({
		queryKey: [...API_KEYS_QUERY_KEY],
		enabled,
		queryFn: async () => {
			const res = await authClient.apiKey.list({
				query: {
					organizationId: session?.session.activeOrganizationId || undefined,
				},
			});
			return res?.data?.apiKeys ?? null;
		},
		retry: (failureCount, error) => {
			const status = getErrorStatus(error);
			if (status === 401 || status === 403) return false;
			return failureCount < 2;
		},
	});

	/**
	 * =========================
	 * CREATE API KEY
	 * =========================
	 */
	const createMutation = useMutation<
		Awaited<ReturnType<typeof authClient.apiKey.create>>,
		Error,
		Omit<
			Parameters<typeof authClient.apiKey.create>[0],
			"organizationId" | "metadata"
		>
	>({
		mutationFn: async (
			vars: Omit<
				Parameters<typeof authClient.apiKey.create>[0],
				"organizationId" | "metadata"
			>
		) => {
			return await authClient.apiKey.create({
				...vars,
				organizationId: session?.session?.activeOrganizationId,
			});
		},
	});

	/**
	 * =========================
	 * UPDATE API KEY
	 * =========================
	 */
	const updateMutation = useMutation<
		Awaited<ReturnType<typeof authClient.apiKey.update>>,
		Error,
		Parameters<typeof authClient.apiKey.update>[0]
	>({
		mutationFn: async (
			vars: Parameters<typeof authClient.apiKey.update>[0]
		) => {
			return await authClient.apiKey.update(vars);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: API_KEYS_QUERY_KEY,
			});
		},
	});

	/**
	 * =========================
	 * DELETE API KEY
	 * =========================
	 */
	const deleteMutation = useMutation<
		Awaited<ReturnType<typeof authClient.apiKey.delete>>,
		Error,
		Parameters<typeof authClient.apiKey.delete>[0]
	>({
		mutationFn: async (
			vars: Parameters<typeof authClient.apiKey.delete>[0]
		) => {
			return await authClient.apiKey.delete(vars);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: API_KEYS_QUERY_KEY,
			});
		},
	});

	const loading =
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending ||
		listQuery.isFetching;

	return {
		// Query
		apiKeys: listQuery.data ?? null,
		isLoading: loading,

		getApiKeyQueryOptions,

		// Mutations
		createApiKey: createMutation.mutate,
		createApiKeyAsync: createMutation.mutateAsync,

		updateApiKey: updateMutation.mutate,
		updateApiKeyAsync: updateMutation.mutateAsync,

		deleteApiKey: deleteMutation.mutate,
		deleteApiKeyAsync: deleteMutation.mutateAsync,
	};
}
