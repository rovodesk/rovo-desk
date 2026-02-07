<<<<<<< HEAD
<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateUUID } from "@zero-heads-lab/shared/utils";
import { useAuthContext } from "../client/context";
import type { MutationOptions, Organization } from "../types";

export const useCreateDomain = (options?: MutationOptions) => {
	const queryClient = useQueryClient();
	const { authClient } = useAuthContext();

	const {
		mutate: createDomain,
		isPending,
		variables,
	} = useMutation({
		mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
			const { data, error } = await authClient.organization.create({
				name,
				slug,
			});
			if (error) throw error;
			return data;
		},

		// ✅ OPTIMISTIC INSERT
		onMutate: async ({ name, slug }) => {
			await queryClient.cancelQueries({ queryKey: ["auth", "domains"] });

			const previousOrgs =
				queryClient.getQueryData<Organization[]>(["auth", "domains"]) ?? [];

			const optimisticOrg = {
				id: `${generateUUID("team-")}`,
				name,
				slug,
				__optimistic: true,
			};

			queryClient.setQueryData(
				["auth", "domains"],
				[...previousOrgs, optimisticOrg]
			);

			return { previousOrgs, optimisticId: optimisticOrg.id };
		},

		onError: (error, _vars, ctx) => {
			if (ctx?.previousOrgs) {
				queryClient.setQueryData(["auth", "domains"], ctx.previousOrgs);
			}

			options?.onError?.(error);
		},

		onSuccess: async (res, _vars, ctx) => {
			// ✅ Replace ONLY the optimistic org
			queryClient.setQueryData(
				["auth", "domains"],
				(orgs: Organization[] = []) =>
					orgs.map((org) => (org.id === ctx?.optimisticId ? res : org))
			);

			await authClient.organization.setActive({
				organizationId: res?.id,
			});

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "domains"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "teams"] }),
			]);

			options?.onSuccess?.(_vars);
		},
	});

	return {
		createDomain,
		isPending,
		createdDomain: variables,
	};
};
