import { useQuery } from "@tanstack/react-query";
import { organizationsQueryOptions } from "../lib/queries";
import { useAuth } from "./use-auth";

export const useOrganization = () => {
	const { isAuthenticated } = useAuth();

	return useQuery({
		...organizationsQueryOptions(),
		enabled: isAuthenticated,
		select: (data) => ({
			currentOrganization: data.currentOrganization,
			organizations: [
				...new Set([...data.organizations, data.currentOrganization]),
			],
		}),
	});
};
