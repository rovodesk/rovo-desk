import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useSession } from "@zero-heads-lab/auth/hooks";
import type { Profile } from "@zero-heads-lab/database/repositories/profile/queries";
import { orpcQuery } from "@zero-heads-lab/transport/query";

export function useProfile(
	userId?: string,
	options?: UseQueryOptions<Profile>
) {
	const { session, isLoading: isSessionLoading } = useSession();

	const resolvedUserId = userId ?? session?.user?.id;

	const query = useQuery<Profile>(
		orpcQuery.profile.get.queryOptions({
			input: resolvedUserId ? { userId: resolvedUserId } : undefined,
			enabled: Boolean(resolvedUserId) && !isSessionLoading,
			...options,
		})
	);

	return query;
}
