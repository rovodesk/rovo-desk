"use client";

import { useQuery } from "@tanstack/react-query";
import type { Session } from "@zero-heads-lab/auth/types";
import { getErrorStatus } from "@zero-heads-lab/shared/utils";
import { useAuthContext } from "../client/context";

export type UseSessionResult = {
	session: Session | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: unknown;
	refetch: () => void;
};

export function useSession(): UseSessionResult {
	const { authClient } = useAuthContext();

	const { data, isLoading, error, refetch } = useQuery<Session | null>({
		queryKey: ["auth", "session"],
		queryFn: async () => {
			const res = await authClient.getSession();
			return res?.data ?? null;
		},

		// ✅ Auth-friendly caching
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 30, // 30 minutes

		// ✅ Keep session fresh without spamming
		refetchInterval: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: false,

		// ❌ Don’t retry on auth failures
		retry: (failureCount, error) => {
			const status = getErrorStatus(error);
			if (status === 401 || status === 403) return false;
			return failureCount < 2;
		},
	});

	return {
		session: data ?? null,
		isLoading,
		isAuthenticated: Boolean(data),
		error,
		refetch,
	};
}
