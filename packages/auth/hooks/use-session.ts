import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@zero-heads-lab/auth/types";
import { getErrorStatus } from "@zero-heads-lab/shared/utils";
import { useMemo } from "react";
import { useAuthContext } from "../client/context";
import type { AuthSession, DeviceSession } from "../types";

/* ------------------------------------------------ */
/* -------------------- TYPES --------------------- */
/* ------------------------------------------------ */

export type UseSessionResult = {
	session: Session | null;
	loading: boolean;
	isAuthenticated: boolean;
	isAnonymous: boolean;
	error: unknown;
	refetch: () => void;

	deviceSessions: DeviceSession[];

	deleteSession: (token: string) => void;
	deleteSessionAsync: (token: string) => Promise<void>;

	deleteDeviceSession: (
		token: string,
		options?: { onSuccess?: () => void; onError?: () => void }
	) => void;
	deleteDeviceSessionAsync: (token: string) => Promise<void>;
};

/* ------------------------------------------------ */
/* ---------------- MAIN HOOK --------------------- */
/* ------------------------------------------------ */

export function useSession(): UseSessionResult {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	/* ===================================================== */
	/* ====================== SESSION ====================== */
	/* ===================================================== */

	const sessionQuery = useQuery<Session | null>({
		queryKey: ["auth", "session"],
		queryFn: async () => {
			const { data, error } = await authClient.getSession();
			if (error) throw error;
			return data ?? null;
		},

		staleTime: 0,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		refetchOnMount: true,

		retry: (failureCount, error) => {
			const status = getErrorStatus(error);
			if (status === 401 || status === 403) return false;
			return failureCount < 2;
		},
	});

	const { session, isAuthenticated, isAnonymous } = useMemo(() => {
		const session = sessionQuery.data ?? null;

		return {
			session,
			isAuthenticated: Boolean(
				session?.user?.id && session?.user?.role !== "anonymous"
			),
			isAnonymous: Boolean(
				session?.user?.role === "anonymous" || session?.user?.isAnonymous
			),
		};
	}, [sessionQuery.data]);

	/* ===================================================== */
	/* ================= DEVICE SESSIONS =================== */
	/* ===================================================== */

	const deviceSessionsQuery = useQuery<DeviceSession[], Error>({
		queryKey: ["auth", "device-sessions"],
		queryFn: async () => {
			const { data, error } =
				await authClient.multiSession.listDeviceSessions();

			if (error) throw error;
			return data ?? [];
		},
	});

	/* ===================================================== */
	/* ================= DELETE SESSION ==================== */
	/* ===================================================== */

	const deleteSessionMutation = useMutation<
		void,
		Error,
		string,
		{ previous?: AuthSession[] }
	>({
		mutationFn: async (sessionToken: string) => {
			const { error } = await authClient.revokeSession({
				token: sessionToken,
			});
			if (error) throw error;
		},

		onMutate: async (sessionToken) => {
			await queryClient.cancelQueries({
				queryKey: ["auth", "sessions"],
			});

			const previous =
				queryClient.getQueryData<AuthSession[]>(["auth", "sessions"]) ?? [];

			queryClient.setQueryData<AuthSession[]>(
				["auth", "sessions"],
				previous.filter((s) => s.token !== sessionToken)
			);

			return { previous };
		},

		onError: (_err, _token, ctx) => {
			if (ctx?.previous) {
				queryClient.setQueryData(["auth", "sessions"], ctx.previous);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["auth", "sessions"],
			});
		},
	});

	/* ===================================================== */
	/* ============= DELETE DEVICE SESSION ================= */
	/* ===================================================== */

	const deleteDeviceSessionMutation = useMutation<
		void,
		Error,
		string,
		{ previous?: DeviceSession[] }
	>({
		mutationFn: async (sessionToken: string) => {
			const { error } = await authClient.multiSession.revoke({
				sessionToken,
			});
			if (error) throw error;
		},

		onMutate: async (sessionToken) => {
			await queryClient.cancelQueries({
				queryKey: ["auth", "device-sessions"],
			});

			const previous =
				queryClient.getQueryData<DeviceSession[]>([
					"auth",
					"device-sessions",
				]) ?? [];

			queryClient.setQueryData<DeviceSession[]>(
				["auth", "device-sessions"],
				previous.filter((s) => s.session.token !== sessionToken)
			);

			return { previous };
		},

		onError: (_err, _token, ctx) => {
			if (ctx?.previous) {
				queryClient.setQueryData(["auth", "device-sessions"], ctx.previous);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["auth", "device-sessions"],
			});
		},
	});

	/* ===================================================== */
	/* ======================= RETURN ====================== */
	/* ===================================================== */

	const loading =
		sessionQuery.isLoading ||
		deviceSessionsQuery.isLoading ||
		deleteSessionMutation.isPending ||
		deleteDeviceSessionMutation.isPending;

	const error =
		sessionQuery.error ||
		deviceSessionsQuery.error ||
		deleteSessionMutation.error ||
		deleteDeviceSessionMutation.error;

	const refetch = () => {
		sessionQuery.refetch();
		deviceSessionsQuery.refetch();
	};

	return {
		/* Session */
		session,
		loading,
		isAuthenticated,
		isAnonymous,
		error,
		refetch,

		/* Device Sessions */
		deviceSessions: deviceSessionsQuery.data ?? [],

		/* Delete Session */
		deleteSession: deleteSessionMutation.mutate,
		deleteSessionAsync: deleteSessionMutation.mutateAsync,

		/* Delete Device Session */
		deleteDeviceSession: deleteDeviceSessionMutation.mutate,
		deleteDeviceSessionAsync: deleteDeviceSessionMutation.mutateAsync,
	};
}
