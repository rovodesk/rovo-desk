/** biome-ignore-all lint/suspicious/noExplicitAny: Data accepts any value */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthRole } from "@/access-control";
import { keys } from "../client";
import { useAuthContext } from "../client/context";

const LIMIT = 10;

export interface ListUsersParams {
	role?: AuthRole | "all";
	email?: string;
	page?: number;
	limit?: number;
}

export const useAdmin = () => {
	const { authClient } = useAuthContext();
	const queryClient = useQueryClient();

	const adminCallbackURL =
		keys.VITE_ADMIN_SIGN_IN_CALLBACK_URL ??
		`${window.location.origin}/auth/callback/cognito`;

	const queryKeys = {
		users: ["admin", "users"],
		session: ["auth", "session"],
	};

	/* ---------------- session sync ---------------- */

	const handleSessionSync = async () => {
		await queryClient.invalidateQueries({
			queryKey: queryKeys.session,
		});
	};

	const adminSignInMutation = useMutation({
		mutationFn: async (redirect?: string) => {
			if (!adminCallbackURL) {
				throw new Error(
					"VITE_ADMIN_SIGN_IN_CALLBACK_URL callback URL is not defined"
				);
			}

			const callback = redirect
				? `${adminCallbackURL}?redirect=${encodeURIComponent(redirect)}`
				: adminCallbackURL;

			return await authClient.signIn.social({
				provider: "cognito",
				callbackURL: callback,
				requestSignUp: false,
			});
		},

		onSuccess: handleSessionSync,
	});

	const useListUsers = ({
		role = "all",
		email = "",
		page = 1,
		limit = LIMIT,
	}: ListUsersParams) => {
		return useQuery({
			queryKey: ["admin", "users", role, email, page],
			queryFn: async () => {
				const offset = (page - 1) * limit;

				const res = await authClient.admin.listUsers({
					query: {
						searchValue: email || undefined,
						searchField: "email",
						searchOperator: "contains",

						filterField: role !== "all" ? "role" : undefined,
						filterValue: role !== "all" ? role : undefined,
						filterOperator: role !== "all" ? "eq" : undefined,

						limit,
						offset,
						sortBy: "createdAt",
						sortDirection: "desc",
					},
					fetchOptions: { credentials: "include" },
				});

				if (res.error) throw res.error;

				return res.data;
			},

			staleTime: 30_000,
		});
	};

	const createUserMutation = useMutation({
		mutationFn: async (data: {
			name: string;
			email: string;
			role?: AuthRole;
			autoVerify?: boolean;
			data?: Record<string, any>;
		}) => {
			const { autoVerify, ...userData } = data;

			const createData = {
				...userData,
				data: {
					...userData.data,
					...(autoVerify ? { emailVerified: true } : {}),
				},
			};

			const res = await authClient.admin.createUser(createData);

			if (res?.error) {
				throw new Error(res.error.message || "Failed to create user");
			}

			if (!autoVerify) {
				try {
					await authClient.sendVerificationEmail({
						email: data.email,
						callbackURL: "/dashboard",
					});
				} catch (error) {
					console.error("Failed to send verification email:", error);
				}
			}

			return res.data;
		},

		/* -------- optimistic update -------- */

		onMutate: async (newUser) => {
			await queryClient.cancelQueries({ queryKey: ["admin", "users"] });

			const previousUsers = queryClient.getQueriesData({
				queryKey: queryKeys.users,
			});

			queryClient.setQueriesData({ queryKey: queryKeys.users }, (old: any) => {
				if (!old) return old;

				return {
					...old,
					users: [
						{
							id: `optimistic-${Date.now()}`,
							name: newUser.name,
							email: newUser.email,
							role: newUser.role ?? "user",
							emailVerified: false,
							banned: false,
							createdAt: new Date().toISOString(),
						},
						...old.users,
					],
					total: old.total + 1,
				};
			});

			return { previousUsers };
		},

		onError: (_err, _newUser, context) => {
			if (context?.previousUsers) {
				context.previousUsers.forEach(([key, data]) => {
					queryClient.setQueryData(key, data);
				});
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "users"],
			});
		},
	});

	return {
		/* queries */
		useListUsers,

		/* mutations */
		createUser: createUserMutation.mutate,
		createUserAsync: createUserMutation.mutateAsync,

		adminSignIn: adminSignInMutation.mutate,
		adminSignInAsync: adminSignInMutation.mutateAsync,

		/* states */
		isCreatingUser: createUserMutation.isPending,
		createUserError: createUserMutation.error,

		isSigningIn: adminSignInMutation.isPending,
		signInError: adminSignInMutation.error,
	};
};
