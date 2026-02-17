import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateUUID, getErrorStatus } from "@zero-heads-lab/shared/utils";
import { useMemo } from "react";
import type { AuthRole } from "../access-control";
import { useAuthContext } from "../client/context";
import type { AuthClient, Organization } from "../types";
import { useSession } from "./use-session";

/* ------------------------------------------------ */
/* -------------------- TYPES --------------------- */
/* ------------------------------------------------ */

type FullOrganization = Awaited<
	ReturnType<AuthClient["organization"]["getFullOrganization"]>
>["data"];

type ListOrganizationsResponse = Organization[];

/* ------------------------------------------------ */
/* ---------------- MAIN HOOK --------------------- */
/* ------------------------------------------------ */

export function useOrganization(providedOrganizationId?: string) {
	const queryClient = useQueryClient();
	const { authClient } = useAuthContext();
	const { session } = useSession();

	/* ------------------------------------------------ */
	/* ------------------ RESOLVE ID ------------------ */
	/* ------------------------------------------------ */

	const organizationId = useMemo<string | undefined>(() => {
		const id =
			providedOrganizationId ??
			session?.session.activeOrganizationId ??
			undefined;

		return id ?? undefined; // removes null
	}, [providedOrganizationId, session]);

	const userId = session?.user?.id;

	/* ===================================================== */
	/* ================= LIST ORGANIZATIONS ================= */
	/* ===================================================== */

	const {
		data: domains = [],
		isLoading: isDomainsLoading,
		error: domainsError,
		refetch: refetchDomains,
	} = useQuery<ListOrganizationsResponse>({
		queryKey: ["auth", "domains", userId],
		queryFn: async () => {
			const { data, error } = await authClient.organization.list();
			if (error) throw error;
			return data ?? [];
		},
		enabled: !!userId,
	});

	/* ===================================================== */
	/* =============== GET ORGANIZATION DETAILS ============= */
	/* ===================================================== */

	const {
		data: organization,
		isLoading: isLoadingOrganization,
		error: organizationError,
		refetch: refetchOrganization,
	} = useQuery<FullOrganization | null>({
		queryKey: ["auth", "organization", organizationId],
		queryFn: async () => {
			if (!organizationId) return null;

			const { data, error } = await authClient.organization.getFullOrganization(
				{
					query: { organizationId },
				}
			);

			if (error) throw error;
			return data ?? null;
		},
		enabled: !!organizationId,
		retry: (failureCount, err) => {
			const status = getErrorStatus(err);
			if (status === 404 || status === 405) return false;
			return failureCount < 2;
		},
	});

	/* ===================================================== */
	/* ================= SWITCH ORGANIZATION ================= */
	/* ===================================================== */

	const switchMutation = useMutation<void, Error, string>({
		mutationFn: async (domainId: string) => {
			await authClient.organization.setActive({
				organizationId: domainId,
			});

			await authClient.organization.setActiveTeam({
				teamId: null,
			});
		},

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "domains"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "teams"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "organization"] }),
			]);
		},
	});

	/* ===================================================== */
	/* ================= CREATE ORGANIZATION ================ */
	/* ===================================================== */

	const createMutation = useMutation<
		Organization,
		Error,
		{ name: string; slug: string },
		{ previous: Organization[]; optimisticId: string }
	>({
		mutationFn: async ({ name, slug }) => {
			const { data, error } = await authClient.organization.create({
				name,
				slug,
			});
			if (error) throw error;
			return data as Organization;
		},

		onMutate: async ({ name, slug }) => {
			await queryClient.cancelQueries({
				queryKey: ["auth", "domains", userId],
			});

			const previous =
				queryClient.getQueryData<Organization[]>(["auth", "domains", userId]) ??
				[];

			const optimisticId = generateUUID("org-");

			const optimisticOrg: Organization = {
				id: optimisticId,
				name,
				slug,
			};

			queryClient.setQueryData<Organization[]>(
				["auth", "domains", userId],
				[...previous, optimisticOrg]
			);

			return { previous, optimisticId };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.previous) {
				queryClient.setQueryData(["auth", "domains", userId], ctx.previous);
			}
		},

		onSuccess: async (res, _vars, ctx) => {
			queryClient.setQueryData<Organization[]>(
				["auth", "domains", userId],
				(orgs = []) =>
					orgs.map((org) => (org.id === ctx?.optimisticId ? res : org))
			);

			await authClient.organization.setActive({
				organizationId: res.id,
			});

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "domains"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "teams"] }),
			]);
		},
	});

	/* ===================================================== */
	/* ================= DELETE ORGANIZATION ================ */
	/* ===================================================== */

	const deleteMutation = useMutation<void, Error, string>({
		mutationFn: async (id) => {
			const { error } = await authClient.organization.delete({
				organizationId: id,
			});
			if (error) throw error;
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["auth", "domains"],
			});
		},
	});

	/* ===================================================== */
	/* ===================== INVITE MEMBER ================== */
	/* ===================================================== */

	const inviteMutation = useMutation<
		unknown,
		Error,
		{ email: string; role: AuthRole }
	>({
		mutationFn: async ({ email, role }) => {
			if (!organizationId) throw new Error("Organization ID is required");

			const { data, error } = await authClient.organization.inviteMember({
				email,
				role,
				organizationId,
			});

			if (error) throw error;
			return data;
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["auth", "organization", organizationId],
			});
		},
	});

	/* ===================================================== */
	/* ======================= RETURN ======================= */
	/* ===================================================== */

	const isLoading =
		isLoadingOrganization ||
		isDomainsLoading ||
		deleteMutation.isPending ||
		createMutation.isPending ||
		inviteMutation.isPending ||
		switchMutation.isPending;

	const isError = organizationError || domainsError;
	const refetch = () => {
		refetchDomains();
		refetchOrganization();
	};

	return {
		/* Active Organization */
		organization: organization ?? null,
		allOrganizations: domains,
		activeOrganizationId: session?.session?.activeOrganizationId,
		loading: isLoading,
		error: isError,
		refetch,

		/* Create */
		createOrganization: createMutation.mutate,
		createOrganizationAsync: createMutation.mutateAsync,

		/* Switch */
		switchOrganization: switchMutation.mutate,
		switchOrganizationAsync: switchMutation.mutateAsync,

		/* Delete */
		deleteOrganization: deleteMutation.mutate,
		deleteOrganizationAsync: deleteMutation.mutateAsync,

		/* Invite */
		inviteMember: inviteMutation.mutate,
		inviteMemberAsync: inviteMutation.mutateAsync,
	};
}
