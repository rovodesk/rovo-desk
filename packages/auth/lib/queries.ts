import {
	getCurrentOrganization,
	getUserOrganizations,
} from "@kinde-oss/kinde-auth-react/utils";
import { queryOptions } from "@tanstack/react-query";

export const organizationKeys = {
	all: ["organizations"] as const,
	current: () => [...organizationKeys.all, "current"] as const,
	list: () => [...organizationKeys.all, "list"] as const,
};

export const organizationsQueryOptions = () =>
	queryOptions({
		queryKey: organizationKeys.all,
		queryFn: async () => {
			const [currentOrganization, organizations] = await Promise.all([
				getCurrentOrganization(),
				getUserOrganizations(),
			]);

			return {
				currentOrganization: currentOrganization ?? null,
				organizations: organizations ?? [],
			};
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: false,
	});
