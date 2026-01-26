import {
	useOrganization,
	useOrganizationList,
} from "@clerk/tanstack-react-start";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export function useDomains() {
	const { organization: activeOrg, isLoaded: isOrgLoaded } = useOrganization();

	const {
		isLoaded: isListLoaded,
		userMemberships,
		setActive,
		createOrganization,
	} = useOrganizationList({
		userMemberships: {
			infinite: true,
		},
	});

	// List of domains
	const domains = useMemo(() => {
		return userMemberships.data?.map((m) => m.organization) ?? [];
	}, [userMemberships.data]);

	// Active domain
	const activeDomain = useMemo(() => {
		return domains.find((d) => d.id === activeOrg?.id) ?? domains[0] ?? null;
	}, [domains, activeOrg?.id]);

	// Mutation for creating a domain
	const createDomainMutation = useMutation({
		mutationFn: async (input: { name: string; slug: string }) => {
			if (!createOrganization) throw new Error("Clerk not ready");
			const org = await createOrganization(input);
			await setActive?.({ organization: org.id });
			await userMemberships.revalidate();
			return org;
		},
	});

	// 4. Mutation for switching
	const switchDomainMutation = useMutation({
		mutationFn: async (domainId: string) => {
			await setActive?.({ organization: domainId });
		},
	});

	return {
		domains, // Plain array is easier to use than a Query object here
		activeDomain,
		isLoading: !(isOrgLoaded && isListLoaded) || userMemberships.isLoading,
		createDomain: createDomainMutation,
		switchDomain: switchDomainMutation,
	};
}
