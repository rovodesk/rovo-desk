import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../client/context";
import type { DeviceSession } from "../types";

type UseListDeviceSessionsResult = {
	deviceSessions: DeviceSession[];
	isLoading: boolean;
	error: Error | null;
	refetch: () => void;
};

export function useListDeviceSessions(
	options?: UseQueryOptions<DeviceSession[], Error>
): UseListDeviceSessionsResult {
	const { authClient } = useAuthContext();

	const query = useQuery<DeviceSession[], Error>({
		queryKey: ["auth", "device-sessions"],
		queryFn: async () => {
			const { data, error } =
				await authClient.multiSession.listDeviceSessions();

			if (error || !data) {
				throw error ?? new Error("Failed to fetch device sessions");
			}

			return data;
		},
		...options,
	});

	return {
		deviceSessions: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
}
