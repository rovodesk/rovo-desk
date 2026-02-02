import { queryOptions } from "@tanstack/react-query";
import { getCurrentProfile } from "@/server/profile";

export const profileQueries = {
	current: () =>
		queryOptions({
			queryKey: ["auth", "profile"],
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
