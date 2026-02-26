/** biome-ignore-all lint/suspicious/noExplicitAny: connection type is not properly typed */
import {
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { orpcQuery } from "@zero-heads-lab/transport/client";
import type {
	CREATE_CHATBOT_CONNECTION_INPUT_DTO,
	DELETE_CHATBOT_CONNECTION_INPUT_DTO,
	ROTATE_CHATBOT_CONNECTION_KEYS_INPUT_DTO,
	TOGGLE_CHATBOT_CONNECTION_INPUT_DTO,
	UPDATE_CHATBOT_CONNECTION_INPUT_DTO,
	UPDATE_CHATBOT_SETTINGS_INPUT_DTO,
} from "@zero-heads-lab/transport/dto/chatbot.dto";
import type { z } from "zod";

/* ------------------------------------------------ */
/* -------------------- TYPES --------------------- */
/* ------------------------------------------------ */

type ChatbotData = Awaited<ReturnType<typeof orpcQuery.chatbot.find.call>>;

type ConnectionListData = Awaited<
	ReturnType<typeof orpcQuery.chatbot.connection.list.call>
>;

type ConnectionData = Awaited<
	ReturnType<typeof orpcQuery.chatbot.connection.find.call>
>;

type CreateConnectionResponse = Awaited<
	ReturnType<typeof orpcQuery.chatbot.connection.create.call>
>;

type RotateConnectionKeysResponse = Awaited<
	ReturnType<typeof orpcQuery.chatbot.connection.rotateKeys.call>
>;

type UpdateSettingsInput = z.infer<typeof UPDATE_CHATBOT_SETTINGS_INPUT_DTO>;

type UpdateConnectionInput = z.infer<
	typeof UPDATE_CHATBOT_CONNECTION_INPUT_DTO
>;

type CreateConnectionInput = z.infer<
	typeof CREATE_CHATBOT_CONNECTION_INPUT_DTO
>;

type ToggleConnectionInput = z.infer<
	typeof TOGGLE_CHATBOT_CONNECTION_INPUT_DTO
>;

type RotateConnectionKeysInput = z.infer<
	typeof ROTATE_CHATBOT_CONNECTION_KEYS_INPUT_DTO
>;

type DeleteConnectionInput = z.infer<
	typeof DELETE_CHATBOT_CONNECTION_INPUT_DTO
>;

/* ------------------------------------------------ */
/* ---------------- MAIN HOOK --------------------- */
/* ------------------------------------------------ */

export function useChatbot(
	chatbotQueryOptions?: Omit<
		UseQueryOptions<ChatbotData>,
		"queryKey" | "queryFn"
	>,
	connectionListQueryOptions?: Omit<
		UseQueryOptions<ConnectionListData>,
		"queryKey" | "queryFn"
	>,
	connectionQueryOptions?: Omit<
		UseQueryOptions<ConnectionData>,
		"queryKey" | "queryFn"
	>
) {
	const { session, loading: isSessionLoading } = useSession();
	const queryClient = useQueryClient();

	const organizationId = session?.session.activeOrganizationId;

	/* ===================================================== */
	/* ===================== QUERY KEYS ==================== */
	/* ===================================================== */

	const keys = {
		chatbot: ["chatbot", organizationId],
		connections: ["chatbot-connections", organizationId],
		connection: ["chatbot-connection", organizationId],
		connectionKeys: ["chatbot-connection-keys", organizationId],
	};

	const enabled = Boolean(organizationId) && !isSessionLoading;

	/* ===================================================== */
	/* ======================= QUERIES ===================== */
	/* ===================================================== */
	const getConnectionQueryOptions = (connectionId: string) => ({
		...orpcQuery.chatbot.connection.find.queryOptions({
			enabled,
			queryKey: [...keys.connection, connectionId], // Add ID to key for unique caching
			input: { connectionId },
		}),
		...connectionQueryOptions,
	});

	const chatbotQuery = useQuery<ChatbotData>({
		...orpcQuery.chatbot.find.queryOptions({
			enabled,
			queryKey: keys.chatbot,
		}),
		...chatbotQueryOptions,
	});

	const connectionsQuery = useQuery<ConnectionListData>({
		...orpcQuery.chatbot.connection.list.queryOptions({
			enabled,
			queryKey: keys.connections,
		}),
		...connectionListQueryOptions,
	});

	/* ===================================================== */
	/* ================= OPTIMISTIC HELPERS ================= */
	/* ===================================================== */

	function optimisticListUpdate<T>(updater: (old: T[]) => T[]) {
		queryClient.setQueryData<T[]>(keys.connections, (old) =>
			old ? updater(old) : old
		);
	}

	/* ===================================================== */
	/* ======================= MUTATIONS =================== */
	/* ===================================================== */

	/* ---------- UPDATE SETTINGS ---------- */

	const updateSettings = useMutation<
		void,
		Error,
		UpdateSettingsInput,
		{ previous?: ChatbotData }
	>({
		mutationFn: (input) => orpcQuery.chatbot.updateSettings.call(input),

		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: keys.chatbot });

			const previous = queryClient.getQueryData<ChatbotData>(keys.chatbot);

			queryClient.setQueryData<ChatbotData>(keys.chatbot, (old) =>
				old ? { ...old, ...input } : old
			);

			return { previous };
		},

		onError: (_err, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(keys.chatbot, ctx.previous);
		},

		onSettled: () => queryClient.invalidateQueries({ queryKey: keys.chatbot }),
	});

	/* ---------- CREATE CONNECTION ---------- */

	const createConnection = useMutation<
		CreateConnectionResponse,
		Error,
		CreateConnectionInput,
		{ previous?: ConnectionListData }
	>({
		mutationFn: (input) => orpcQuery.chatbot.connection.create.call(input),

		onMutate: async (input) => {
			await queryClient.cancelQueries({
				queryKey: keys.connections,
			});

			const previous = queryClient.getQueryData<ConnectionListData>(
				keys.connections
			);

			const optimistic = {
				id: `temp-${Date.now()}`,
				...input,
				enabled: true,
				createdAt: new Date(),
				__optimistic: true,
			} as any;

			optimisticListUpdate((old) => [...old, optimistic]);

			return { previous };
		},

		onError: (_err, _input, ctx) => {
			if (ctx?.previous)
				queryClient.setQueryData(keys.connections, ctx.previous);
		},

		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: keys.connections,
			}),
	});

	/* ---------- TOGGLE CONNECTION ---------- */

	const toggleConnection = useMutation<
		void,
		Error,
		ToggleConnectionInput,
		{ previous?: ConnectionListData }
	>({
		mutationFn: (input) => orpcQuery.chatbot.connection.toggle.call(input),

		onMutate: async (input) => {
			await queryClient.cancelQueries({
				queryKey: keys.connections,
			});

			const previous = queryClient.getQueryData<ConnectionListData>(
				keys.connections
			);

			optimisticListUpdate((old) =>
				old.map((conn: any) =>
					conn.id === input.connectionId
						? { ...conn, enabled: !conn.enabled }
						: conn
				)
			);

			return { previous };
		},

		onError: (_err, _input, ctx) => {
			if (ctx?.previous)
				queryClient.setQueryData(keys.connections, ctx.previous);
		},

		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: keys.connections,
			}),
	});

	/* --------- Update Connection ---------- */
	const updateConnection = useMutation<
		void,
		Error,
		UpdateConnectionInput,
		{ previous?: ConnectionListData }
	>({
		mutationFn: (input) => orpcQuery.chatbot.connection.update.call(input),

		onMutate: async (input) => {
			await queryClient.cancelQueries({
				queryKey: keys.connections,
			});

			const previous = queryClient.getQueryData<ConnectionListData>(
				keys.connections
			);

			optimisticListUpdate((old) =>
				old.map((conn: any) =>
					conn.id === input.connectionId ? { ...conn, ...input } : conn
				)
			);

			return { previous };
		},

		onError: (_err, _input, ctx) => {
			if (ctx?.previous)
				queryClient.setQueryData(keys.connections, ctx.previous);
		},

		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: keys.connections,
			}),
	});

	/* ---------- DELETE CONNECTION ---------- */

	const deleteConnection = useMutation<
		void,
		Error,
		DeleteConnectionInput,
		{ previous?: ConnectionListData }
	>({
		mutationFn: (input) => orpcQuery.chatbot.connection.delete.call(input),

		onMutate: async (input) => {
			await queryClient.cancelQueries({
				queryKey: keys.connections,
			});

			const previous = queryClient.getQueryData<ConnectionListData>(
				keys.connections
			);

			optimisticListUpdate((old) =>
				old.filter((conn: any) => conn.id !== input.connectionId)
			);

			return { previous };
		},

		onError: (_err, _input, ctx) => {
			if (ctx?.previous)
				queryClient.setQueryData(keys.connections, ctx.previous);
		},

		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: keys.connections,
			}),
	});

	/* ---------- ROTATE KEYS ---------- */

	const rotateConnectionKeys = useMutation<
		RotateConnectionKeysResponse,
		Error,
		RotateConnectionKeysInput,
		{
			previousConnection?: ConnectionData;
			previousConnections?: ConnectionListData;
		}
	>({
		mutationFn: (input) => orpcQuery.chatbot.connection.rotateKeys.call(input),

		onMutate: async (variables) => {
			const singleKey = [...keys.connection, variables.connectionId];
			const listKey = keys.connections;

			await Promise.all([
				queryClient.cancelQueries({ queryKey: singleKey }),
				queryClient.cancelQueries({ queryKey: listKey }),
			]);

			const previousConnection =
				queryClient.getQueryData<ConnectionData>(singleKey);

			const previousConnections =
				queryClient.getQueryData<ConnectionListData>(listKey);

			return {
				previousConnection,
				previousConnections,
			};
		},

		onSuccess: (data, variables) => {
			if (!(data?.publicKey || data?.privateKey)) return;

			const singleKey = [...keys.connection, variables.connectionId];
			const listKey = keys.connections;

			const applyUpdate = <T extends { keys?: any }>(item: T): T => {
				if (!item) return item;

				const existingKeys = item.keys;

				return {
					...item,
					keys: existingKeys
						? {
								...existingKeys,
								// Only overwrite if returned
								...(data.publicKey ? { publicKey: data.publicKey } : {}),
								...(data.privateKey ? { privateKey: data.privateKey } : {}),
								status: existingKeys.status, // preserve required field
							}
						: {
								...(data.publicKey ? { publicKey: data.publicKey } : {}),
								...(data.privateKey ? { privateKey: data.privateKey } : {}),
								status: "active",
							},
				};
			};

			// 🔥 Update single connection
			queryClient.setQueryData<ConnectionData>(singleKey, (old) =>
				old ? applyUpdate(old) : old
			);

			// 🔥 Update list cache
			queryClient.setQueryData<ConnectionListData>(listKey, (old) =>
				old
					? old.map((conn) =>
							conn.id === variables.connectionId ? applyUpdate(conn) : conn
						)
					: old
			);
		},
		onError: (_err, variables, context) => {
			const singleKey = [...keys.connection, variables.connectionId];
			const listKey = keys.connections;

			if (context?.previousConnection) {
				queryClient.setQueryData(singleKey, context.previousConnection);
			}

			if (context?.previousConnections) {
				queryClient.setQueryData(listKey, context.previousConnections);
			}
		},
	});

	/* ===================================================== */
	/* ======================= RETURN ====================== */
	/* ===================================================== */

	const loading =
		isSessionLoading || chatbotQuery.isLoading || connectionsQuery.isLoading;

	return {
		chatbot: chatbotQuery.data,
		connections: connectionsQuery.data,

		getConnectionQueryOptions,
		loading,

		updateSettings: updateSettings.mutate,
		updateSettingsAsync: updateSettings.mutateAsync,

		createConnection: createConnection.mutate,
		createConnectionAsync: createConnection.mutateAsync,

		toggleConnection: toggleConnection.mutate,
		toggleConnectionAsync: toggleConnection.mutateAsync,

		deleteConnection: deleteConnection.mutate,
		deleteConnectionAsync: deleteConnection.mutateAsync,

		rotateConnectionKeys: rotateConnectionKeys.mutate,
		rotateConnectionKeysAsync: rotateConnectionKeys.mutateAsync,

		updateConnection: updateConnection.mutate,
		updateConnectionAsync: updateConnection.mutateAsync,
	};
}
