import { useMutation } from "@tanstack/react-query";
import type { AuthRole } from "../access-control";
import { useAuthContext } from "../client/context";
import type { MutationOptions } from "../types";
import { useSession } from "./use-session";

export const useInviteMembers = (options?: MutationOptions) => {
	const { authClient } = useAuthContext();
	const { session } = useSession();

	const { mutate, mutateAsync, isPending, variables } = useMutation({
		mutationFn: async ({ email, role }: { email: string; role: AuthRole }) => {
			const { data, error } = await authClient.organization.inviteMember({
				email,
				role,
				organizationId: session?.session?.activeOrganizationId ?? undefined,
			});
			if (error) throw error;
			return data;
		},
		onSuccess: (variables) => {
			options?.onSuccess?.(variables);
		},
		onError: (error) => {
			console.error("Failed to invite members:", error);
			options?.onError?.(error);
		},
	});

	return {
		inviteMembers: mutate,
		inviteMembersAsync: mutateAsync,
		isPending,
		variables,
	};
};
