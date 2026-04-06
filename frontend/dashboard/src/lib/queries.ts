import { queryOptions } from "@tanstack/react-query";

export const organizationKeys = {
	all: ["organizations"] as const,
	current: () => [...organizationKeys.all, "current"] as const,
	list: () => [...organizationKeys.all, "list"] as const,
};

export const organizationsQueryOptions = () =>
	queryOptions({
		queryKey: organizationKeys.all,
		queryFn: () => {
			return {
				currentOrganization: null,
				organizations: [],
			};
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: false,
	});
