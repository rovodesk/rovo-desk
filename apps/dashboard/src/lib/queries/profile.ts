import { queryOptions } from "@tanstack/react-query";
import { getCurrentProfile } from "@/server/profile";

export const profileQueries = {
	/**
	 * Fetch the current user's profile
	 * (onboarding + settings)
	 */
	current: () =>
		queryOptions({
			queryKey: ["profile", "current"],
			queryFn: async () => {
				const profile = await getCurrentProfile();

				if (!profile) {
					throw new Error("Profile not found");
				}

				return profile;
			},
			staleTime: 1000 * 60 * 5, // 5 minutes
		}),
};
