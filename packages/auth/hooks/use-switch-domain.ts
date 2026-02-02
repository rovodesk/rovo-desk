"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationOptions } from "@/types";
import { useAuthContext } from "../client/context";

export function useSwitchDomain(options?: MutationOptions) {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	const {
		mutate: switchDomain,
		isPending,
		variables: switchingId,
	} = useMutation({
		mutationFn: async (domainId: string) => {
			await authClient.organization.setActive({ organizationId: domainId });
			await authClient.organization.setActiveTeam({ teamId: null });
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "domains"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "teams"] }),
			]);

			options?.onSuccess?.();
		},
		onError: (error) => {
			console.error("Failed to switch domain:", error);
			options?.onError?.(error);
		},
	});

	return {
		switchDomain,
		isPending,
		switchingId,
	};
}
